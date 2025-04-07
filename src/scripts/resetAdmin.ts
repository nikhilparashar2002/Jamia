import { config } from 'dotenv';
import { resolve } from 'path';
import mongoose from 'mongoose';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

// Verify required environment variables
if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI must be defined in environment variables');
}

if (!process.env.BCRYPT_SALT_ROUNDS) {
  throw new Error('BCRYPT_SALT_ROUNDS must be defined in environment variables');
}

const MONGODB_URI = process.env.MONGODB_URI;
const BCRYPT_SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS;

import { User } from '../models/User';

async function resetAdmin() {
  try {
    console.log('MongoDB URI found in environment variables');
    console.log('Bcrypt salt rounds:', BCRYPT_SALT_ROUNDS);

    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Successfully connected to MongoDB');

    // Delete existing admin users
    console.log('Deleting existing admin users...');
    const result = await User.deleteMany({ role: 'admin' });
    console.log(`Deleted ${result.deletedCount} admin users`);

    // Create new admin user
    console.log('Creating new admin user...');
    const adminUser = await User.create({
      email: 'admin@seocms.com',
      password: 'Admin@123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    });

    console.log('New admin user created successfully:', {
      email: adminUser.email,
      name: adminUser.fullName,
      role: adminUser.role,
      id: adminUser._id.toString()
    });

    // Verify the user was created
    const verifyUser = await User.findOne({ email: 'admin@seocms.com' });
    if (verifyUser) {
      console.log('Verified: Admin user exists in database');
      // Test password comparison
      const isPasswordValid = await verifyUser.comparePassword('Admin@123');
      console.log('Password verification test:', isPasswordValid ? 'Passed' : 'Failed');
    } else {
      console.log('Warning: Could not verify admin user in database');
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error resetting admin user:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
}

resetAdmin(); 