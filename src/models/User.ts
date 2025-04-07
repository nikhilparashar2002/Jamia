import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

if (!process.env.BCRYPT_SALT_ROUNDS) {
  throw new Error('BCRYPT_SALT_ROUNDS must be defined in environment variables');
}

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10);

const userSchema = new mongoose.Schema({
  profileImage: {
    type: String,
    default: null
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'writer'],
    default: 'writer'
  },
  description: {
    type: String,
    default: null
  },
  designation:{
    type: String,
    default: null
  },
  socials:{
    type: {
      twitter: String,
      linkedin: String,
      facebook: String,
      instagram: String
    },
    default: null
  },
  permit: {
    type: String,
    enum: ['Allowed', 'Restricted'],
    default: 'Restricted'
  },
  lastLogin: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    // Use consistent salt rounds from environment variables
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
};

// Method to update last login
userSchema.methods.updateLastLogin = async function(): Promise<void> {
  this.lastLogin = new Date();
  await this.save();
};

// Define interface for social media links
interface ISocialMedia {
  twitter?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
}

// Create interface for User document
export interface IUser extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'writer';
  permit: 'Allowed' | 'Restricted';
  profileImage?: string;
  description?: string;
  designation?: string;
  socials?: ISocialMedia;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
  fullName: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  updateLastLogin(): Promise<void>;
}

// Check if model exists before creating
export const User = (mongoose.models.User as mongoose.Model<IUser>) || 
  mongoose.model<IUser>('User', userSchema);
