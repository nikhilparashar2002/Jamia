import mongoose, { Schema, Document } from "mongoose";

const TRENDING_LIMIT = 4;

const TrendingSchema: Schema = new Schema({
  blogId: { type: Schema.Types.ObjectId, ref: "Content", required: true },
  position: { type: Number, required: true },
}, {
  timestamps: true
});

// Pre-save hook to maintain maximum 4 documents
TrendingSchema.pre('save', async function(next) {
  try {
    const count = await mongoose.models.Trending.countDocuments();
    if (count >= TRENDING_LIMIT) {
      // Remove the oldest document(s) to maintain the limit
      const oldestDocs = await mongoose.models.Trending
        .find()
        .sort({ createdAt: 1 })
        .limit(count - TRENDING_LIMIT + 1);
      
      await mongoose.models.Trending.deleteMany({
        _id: { $in: oldestDocs.map(doc => doc._id) }
      });
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});

export interface ITrending extends Document {
  blogId: mongoose.Types.ObjectId;
  position: number;
}

// Check if model exists before creating
export const Trending = 
  mongoose.models.Trending || mongoose.model<ITrending>("Trending", TrendingSchema);
