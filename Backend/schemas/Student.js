const mongoose = require('mongoose');
const { Schema } = mongoose;

const studentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  teacherId: {
    type: Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true
  },
  course: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  batch: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  guardianName: {
    type: String,
    required: true
  },
  guardianContact: {
    type: String,
    required: true
  },
  profileComplete: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Student', studentSchema); 