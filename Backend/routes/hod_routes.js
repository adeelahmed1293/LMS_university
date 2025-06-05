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


// Get HOD profile by User ID with base64 image
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const hod = await HOD.findOne({ user: userId }).populate('user', 'fullName email');

    if (!hod) {
      return res.status(404).json({ message: 'HOD profile not found for this user' });
    }

    let profileImageBase64 = null;
    if (hod.profile_image?.data) {
      profileImageBase64 = `data:${hod.profile_image.contentType};base64,${hod.profile_image.data.toString('base64')}`;
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
      profile_image: profileImageBase64,
      createdAt: hod.createdAt,
      updatedAt: hod.updatedAt
    });

  } catch (error) {
    console.error('Error retrieving HOD profile:', error);
    res.status(500).json({ message: error.message });
  }
});


router.put('/:userId', authenticateToken, upload.single('profile_image'), async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      phone_number,
      gender,
      date_of_birth,
      department_name,
      qualification,
      address
    } = req.body;

    console.log("Updating profile for user:", userId);
    console.log("Received update data:", req.body);

    // Find the existing HOD profile
    const existingHOD = await HOD.findOne({ user: userId });
    if (!existingHOD) {
      return res.status(404).json({ message: 'HOD profile not found for this user' });
    }

    // Prepare update data
    const updateData = {
      phone_number: phone_number || existingHOD.phone_number,
      gender: gender || existingHOD.gender,
      date_of_birth: date_of_birth || existingHOD.date_of_birth,
      department_name: department_name || existingHOD.department_name,
      qualification: qualification || existingHOD.qualification,
      address: address || existingHOD.address,
      updatedAt: new Date()
    };

    // Handle profile image update
    if (req.file) {
      updateData.profile_image = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
      console.log("New profile image uploaded");
    }
    // If no new image is uploaded, keep the existing image (don't modify profile_image field)

    // Update the HOD profile
    const updatedHOD = await HOD.findOneAndUpdate(
      { user: userId },
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'fullName email');

    // Prepare response with base64 image
    let profileImageBase64 = null;
    if (updatedHOD.profile_image?.data) {
      profileImageBase64 = `data:${updatedHOD.profile_image.contentType};base64,${updatedHOD.profile_image.data.toString('base64')}`;
    }

    res.status(200).json({
      _id: updatedHOD._id,
      user: updatedHOD.user,
      phone_number: updatedHOD.phone_number,
      gender: updatedHOD.gender,
      date_of_birth: updatedHOD.date_of_birth,
      department_name: updatedHOD.department_name,
      qualification: updatedHOD.qualification,
      address: updatedHOD.address,
      profile_image: profileImageBase64,
      createdAt: updatedHOD.createdAt,
      updatedAt: updatedHOD.updatedAt
    });

  } catch (error) {
    console.error('Error updating HOD profile:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;