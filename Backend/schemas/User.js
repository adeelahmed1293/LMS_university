//user schema
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    // match: [/^[\w-.]+@[\w-]+\.[a-z]{2,}$/, 'Please use a valid email address'],
  },
  role: {
    type: String,
    enum: ['STUDENT', 'TEACHER', 'HOD'],
    default: 'STUDENT',
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  createdAt : {
    type: Date,
    default: Date.now,
  },
  acceptedTerms: {
    type: Boolean,
    required: true,
    default: false,
  },
  profileComplete: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('User', userSchema);
