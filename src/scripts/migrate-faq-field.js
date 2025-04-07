/**
 * One-time migration script to add the faq field to all existing documents
 * 
 * Run this script using:
 * node -r dotenv/config src/scripts/migrate-faq-field.js
 */

require('dotenv').config({ path: './.env.local' }); // Explicitly set the path to .env file
const mongoose = require('mongoose');

// Connect to MongoDB
async function main() {
  // Check if MongoDB URI exists
  const MONGODB_URI = process.env.MONGODB_URI;
  
  if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI environment variable is not defined!');
    console.error('Make sure your .env file contains MONGODB_URI=your_mongodb_connection_string');
    console.error('Alternatively, you can run this script with:');
    console.error('MONGODB_URI=your_connection_string node src/scripts/migrate-faq-field.js');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Define the Content model inline for migration purposes
    const ContentSchema = new mongoose.Schema({
      faq: {
        type: [{
          question: String,
          answer: String
        }],
        default: []
      }
    }, { strict: false }); // Use strict:false to allow flexible schema

    const Content = mongoose.models.Content || mongoose.model('Content', ContentSchema);

    try {
      // Find all documents without a faq field or with faq set to null/undefined
      const missingFaqCount = await Content.countDocuments({ 
        $or: [
          { faq: { $exists: false } }, 
          { faq: null }
        ] 
      });
      
      console.log(`Found ${missingFaqCount} documents without the faq field`);

      if (missingFaqCount > 0) {
        // Update all documents that don't have a faq field
        const updateResult = await Content.updateMany(
          { 
            $or: [
              { faq: { $exists: false } }, 
              { faq: null }
            ]
          },
          { $set: { faq: [] } }
        );

        console.log(`Updated ${updateResult.modifiedCount} documents with empty faq arrays`);
      }

      // Verify the update
      const stillMissingCount = await Content.countDocuments({
        $or: [
          { faq: { $exists: false } },
          { faq: null }
        ]
      });

      console.log(`Documents still missing faq field: ${stillMissingCount}`);
      console.log('Migration completed successfully');

    } catch (error) {
      console.error('Migration failed:', error);
    } finally {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Unhandled error in main function:', err);
  process.exit(1);
});
