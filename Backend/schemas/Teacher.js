// teacher schema
const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // Ensure one teacher profile per user
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other']
  },
  dateOfHire: {
    type: Date,
    required: true
  },
  subjects: [{
    type: String,
    required: true,
    trim: true
  }],
  dept_name: {
    type: String,
    required: true,
    trim: true
  },
  qualification: {
    type: String,
    required: true,
    trim: true
  },
  date_of_birth: {
    type: Date,
    required: true
  },
  profile_image: {
    data: Buffer,
    contentType: String
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});


const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;