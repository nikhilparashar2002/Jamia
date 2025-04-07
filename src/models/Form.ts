import mongoose from "mongoose";

const formSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  course: {
    type: String,
    required: [true, 'Course is required'],
  },
  educationMode:{
    type: String,
    required: [true, 'Education Mode is required'],
    enum: ['Regular', 'Distance', 'Online', 'Vocational']
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'completed', 'cancelled'],
    default: 'pending'
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for common queries
formSchema.index({ status: 1, createdAt: -1 });
formSchema.index({ email: 1 });
formSchema.index({ phone: 1 });

export const Form = mongoose.models.Form || mongoose.model('Form', formSchema);
