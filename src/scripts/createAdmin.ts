import { config } from 'dotenv';
import { resolve } from 'path';
import mongoose from 'mongoose';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { User } from '../models/User';

async function createAdminUser() {
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

    // Check if admin already exists
    console.log('Checking for existing admin...');
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('Admin user already exists:', {
        email: existingAdmin.email,
        name: `${existingAdmin.firstName} ${existingAdmin.lastName}`,
        role: existingAdmin.role
      });
      await mongoose.disconnect();
      process.exit(0);
    }

    // Create admin user
    console.log('Creating new admin user...');
    const adminUser = await User.create({
      email: 'admin@seocms.com',
      password: 'Admin@123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    });

    console.log('Admin user created successfully:', {
      email: adminUser.email,
      name: adminUser.fullName,
      role: adminUser.role,
      id: adminUser._id.toString()
    });

    // Verify the user was created
    const verifyUser = await User.findOne({ email: 'admin@seocms.com' });
    if (verifyUser) {
      console.log('Verified: Admin user exists in database');
    } else {
      console.log('Warning: Could not verify admin user in database');
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
}

createAdminUser(); 