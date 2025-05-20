const mongoose = require('mongoose');

const hodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  phone_number: {
    type: String,
    maxlength: 20
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  date_of_birth: {
    type: Date
  },
  profile_image: {
    data: Buffer,              // Store binary data of the image
    contentType: String        // Store the MIME type of the image
  },
  department_name: {
    type: String,
    required: true,
    maxlength: 100
  },
  qualification: {
    type: String,
    maxlength: 255
  },
  address: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('HOD', hodSchema);