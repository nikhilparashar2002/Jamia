import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  isConnecting: boolean;
  lastPingTime: number;
}

// Define the global mongoose type more precisely
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

// Initialize the cached connection
let cached: MongooseCache = global.mongoose || { 
  conn: null, 
  promise: null,
  isConnecting: false,
  lastPingTime: 0
};

// Save to global
if (!global.mongoose) {
  global.mongoose = cached;
}

// Updated connection options compatible with Mongoose 8.9.5
const connectionOptions = {
  bufferCommands: true,
  maxPoolSize: 10, 
  minPoolSize: 3, // Keep at least 3 connections in the pool
  serverSelectionTimeoutMS: 30000, // Increased from 15000 to 30000 ms
  socketTimeoutMS: 75000, // Increased from 45000 to 75000 ms
  family: 4, // Use IPv4, skip trying IPv6
  autoIndex: false, // Don't build indexes in production for better startup
  connectTimeoutMS: 30000, // Increased connection timeout
  // Removed: keepAlive (not supported in mongoose 8.9.5)
  retryWrites: true,
  heartbeatFrequencyMS: 20000, // Check connection every 20 seconds
  waitQueueTimeoutMS: 15000, // Increased wait queue timeout
  maxIdleTimeMS: 300000, // Close idle connections after 5 minutes
  maxConnecting: 5 // Limit parallel connection attempts
};

// For connection health checking
const PING_INTERVAL = 60000; // Ping every 60 seconds to keep connection alive
let pingTimer: NodeJS.Timeout | null = null;

/**
 * Check if mongoose connection is ready
 */
function isConnected(): boolean {
  return !!cached.conn && mongoose.connection.readyState === 1;
}

/**
 * Ping the database to keep connection alive
 */
async function pingDatabase(): Promise<void> {
  try {
    // Only ping if we're still connected and db is available
    if (isConnected() && mongoose.connection.db) {
      // A lightweight command that doesn't strain resources
      await mongoose.connection.db.admin().ping();
      cached.lastPingTime = Date.now();
      // console.log('Database ping successful');
    } else if (isConnected() && !mongoose.connection.db) {
      // If connection exists but db object isn't ready, try a different approach
      await mongoose.connection.startSession().then(session => session.endSession());
      cached.lastPingTime = Date.now();
    }
  } catch (error) {
    console.warn('Database ping failed, connection might be down:', error);
    
    // If ping fails, try to reconnect
    cached.conn = null;
    cached.promise = null;
    cached.isConnecting = false;
    
    try {
      await connectDB();
    } catch (reconnectError) {
      console.error('Failed to reconnect after ping failure:', reconnectError);
    }
  }
}

/**
 * Setup regular pings to keep the connection alive
 */
function setupConnectionKeepAlive() {
  // Clear any existing timer
  if (pingTimer) {
    clearInterval(pingTimer);
  }
  
  // Setup new ping timer
  pingTimer = setInterval(pingDatabase, PING_INTERVAL);
  
  // Add listeners to connection events
  mongoose.connection.on('disconnected', handleDisconnect);
  mongoose.connection.on('error', handleError);
  
  // Ensure we clean up if the process exits
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  process.on('beforeExit', cleanup);
}

/**
 * Handle disconnection events
 */
function handleDisconnect() {
  console.warn('MongoDB disconnected! Attempting to reconnect...');
  cached.conn = null;
  cached.promise = null;
  cached.isConnecting = false;
  
  // Try to reconnect with a small delay
  setTimeout(async () => {
    try {
      await connectDB();
    } catch (error) {
      console.error('Reconnection attempt failed:', error);
    }
  }, 1000);
}

/**
 * Handle connection errors
 */
function handleError(error: Error) {
  console.error('MongoDB connection error:', error);
  
  // Only reset connection if it's a critical error
  if (error.name === 'MongoNetworkError' || error.message.includes('topology')) {
    cached.conn = null;
    cached.promise = null;
  }
}

/**
 * Clean up resources when shutting down
 */
async function cleanup() {
  if (pingTimer) {
    clearInterval(pingTimer);
    pingTimer = null;
  }
  
  if (cached.conn) {
    try {
      await mongoose.disconnect();
      console.log('MongoDB disconnected through app termination');
    } catch (error) {
      console.error('Error during MongoDB disconnect:', error);
    }
  }
  
  // Remove event listeners
  mongoose.connection.removeAllListeners();
}

/**
 * Connect to MongoDB with improved retry logic
 */
async function connectDB(retries = 3): Promise<typeof mongoose> {
  // If we have an existing connection, return it
  if (isConnected()) {
    // If it's been more than 10 minutes since last ping, do a test ping
    if (Date.now() - cached.lastPingTime > 600000) {
      pingDatabase().catch(console.error);
    }
    return cached.conn as typeof mongoose;
  }

  // If a connection is in progress, wait for it
  if (cached.isConnecting && cached.promise) {
    try {
      return await cached.promise;
    } catch (e) {
      console.error('MongoDB connection failed, retrying...', e);
    }
  }

  // Set connecting flag
  cached.isConnecting = true;

  try {
    // Clear any existing promise to start fresh
    if (!cached.promise) {
      console.log('Creating new MongoDB connection...');
      cached.promise = mongoose.connect(MONGODB_URI as string, connectionOptions);
    }

    cached.conn = await cached.promise;
    cached.lastPingTime = Date.now();
    
    // Setup connection keep-alive
    setupConnectionKeepAlive();
    
    console.log('MongoDB connected successfully');
    return cached.conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    
    // Reset for retry
    cached.promise = null;
    
    // Retry logic with exponential backoff
    if (retries > 0) {
      const delay = Math.pow(2, 4 - retries) * 1000; // Exponential backoff: 1s, 2s, 4s
      console.log(`Retrying connection in ${delay/1000}s... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return connectDB(retries - 1);
    } else {
      cached.isConnecting = false;
      throw error;
    }
  } finally {
    cached.isConnecting = false;
  }
}

/**
 * Wrapper to ensure DB connection before running queries
 */
export async function withDbConnection<T>(operation: () => Promise<T>): Promise<T> {
  try {
    await connectDB();
    return await operation();
  } catch (error) {
    if (
      error instanceof Error && 
      (error.name === 'MongoNotConnectedError' || 
       error.message.includes('not connected') ||
       error.message.includes('topology closed'))
    ) {
      console.warn('Connection lost during operation, reconnecting...');
      
      // Force reset connection state
      cached.conn = null;
      cached.promise = null;
      cached.isConnecting = false;
      
      // Try again with a fresh connection
      await connectDB();
      return await operation();
    }
    throw error;
  }
}

export { connectDB, isConnected };
export default connectDB;
