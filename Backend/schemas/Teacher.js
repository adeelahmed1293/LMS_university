const mongoose = require('mongoose');
const { Schema } = mongoose;

const teacherSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  hodId: {
    type: Schema.Types.ObjectId,
    ref: 'Hod',
    required: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  subjects: [{
    type: String,
    required: true
  }],
  contactNumber: {
    type: String,
    required: true
  },
 
  qualification: {
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

module.exports = mongoose.model('Teacher', teacherSchema); 