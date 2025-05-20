const express = require('express');
const router = express.Router();
const multer = require('multer');
const HOD = require('../schemas/Hod');
const User = require('../schemas/User');
const jwt = require('jsonwebtoken');
const path = require('path');

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Authentication required' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // limit file size to 5MB
  }
});

// Create HOD profile
router.post('/', authenticateToken, upload.single('profile_image'), async (req, res) => {
  try {
    const {
      user,  // This is the user ID from User model
      phone_number,
      gender,
      date_of_birth,
      department_name,
      qualification,
      address
    } = req.body;

    console.log("Received profile data:", req.body);
    console.log("User ID:", user);

    // Verify that the user exists
    const existingUser = await User.findById(user);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if HOD profile already exists for this user
    const existingHOD = await HOD.findOne({ user: user });
    if (existingHOD) {
      return res.status(409).json({ message: "Profile already exists for this user" });
    }

    // Create HOD object with profile data
    const hodData = {
      user,
      phone_number,
      gender,
      date_of_birth,
      department_name,
      qualification,
      address
    };

    // Add image data if a file was uploaded
    if (req.file) {
      hodData.profile_image = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    const newHOD = new HOD(hodData);
    const savedHOD = await newHOD.save();
    
    // Update the User model to mark profile as complete
    await User.findByIdAndUpdate(user, { profileComplete: true });

    res.status(201).json({
      _id: savedHOD._id,
      user: savedHOD.user,
      phone_number: savedHOD.phone_number,
      gender: savedHOD.gender,
      date_of_birth: savedHOD.date_of_birth,
      department_name: savedHOD.department_name,
      qualification: savedHOD.qualification,
      address: savedHOD.address,
      hasProfileImage: savedHOD.profile_image ? true : false,
      createdAt: savedHOD.createdAt,
      updatedAt: savedHOD.updatedAt
    });

  } catch (error) {
    console.error('Profile creation error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get HOD profile
router.get('/:id', async (req, res) => {
  try {
    const hod = await HOD.findById(req.params.id)
      .populate('user', 'fullName email'); // Populate user data
    
    if (!hod) {
      return res.status(404).json({ message: 'HOD profile not found' });
    }
    
    res.status(200).json({
      _id: hod._id,
      user: hod.user,
      phone_number: hod.phone_number,
      gender: hod.gender,
      date_of_birth: hod.date_of_birth,
      department_name: hod.department_name,
      qualification: hod.qualification,
      address: hod.address,
      hasProfileImage: hod.profile_image ? true : false,
      createdAt: hod.createdAt,
      updatedAt: hod.updatedAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Retrieve the profile image
router.get('/:id/profile-image', async (req, res) => {
  try {
    const hod = await HOD.findById(req.params.id);
    if (!hod || !hod.profile_image || !hod.profile_image.data) {
      return res.status(404).send('Image not found');
    }
    
    res.set('Content-Type', hod.profile_image.contentType);
    res.send(hod.profile_image.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;