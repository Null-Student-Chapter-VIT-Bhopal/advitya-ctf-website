import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const PendingUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  otp: {
    type: String,
    required: true,
  },

  otpExpiresAt: {
    type: Date,
    required: true,
  },

  attempts: {
    type: Number,
    default: 0,
    max: 5, 
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300,
  },
});

export default mongoose.models.PendingUser ||
  mongoose.model("PendingUser", PendingUserSchema);
