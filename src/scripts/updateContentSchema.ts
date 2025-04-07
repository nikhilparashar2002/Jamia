import { config } from 'dotenv';
import { resolve } from 'path';
import mongoose from 'mongoose';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { Content } from '../models/Content';

async function updateContentSchema() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    console.log('MongoDB URI found in environment variables');

    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Successfully connected to MongoDB');

    console.log('Updating content schema...');
    await Content.updateMany(
      {},
      {
        $set: {
          title: 'Default Title',
          description: 'Default Description',
        },
      }
    );

    console.log('Content schema updated successfully');
  } catch (error) {
    console.error('Error updating content schema:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

updateContentSchema();