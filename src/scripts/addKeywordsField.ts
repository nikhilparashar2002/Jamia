import { config } from 'dotenv';
import { resolve } from 'path';
import mongoose from 'mongoose';
import { Content } from '../models/Content';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

async function addKeywordsField() {
  try {
    // Check if MongoDB URI is available
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    console.log('MongoDB URI found in environment variables');

    // Connect to MongoDB
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Successfully connected to MongoDB');

    // Update all documents to include keywords field as an empty array if it doesn't exist
    console.log('Adding keywords field to existing content...');
    await Content.updateMany(
      { keywords: { $exists: false } },
      { $set: { keywords: [] } }
    );

    console.log('Content schema updated successfully');
  } catch (error) {
    console.error('Error updating content schema:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

addKeywordsField();