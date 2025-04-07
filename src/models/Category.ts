import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v: string) {
        return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v);
      },
      message: 'Slug must contain only lowercase letters, numbers, and hyphens'
    }
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  metadata: {
    icon: String,
    color: String,
    displayOrder: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

categorySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

export default Category;