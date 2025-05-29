const express = require('express');
const router = express.Router();
const multer = require('multer');
const jwt = require('jsonwebtoken');
const path = require('path');

// Make sure these imports are correct
const Teacher = require('../schemas/Teacher');
const User = require('../schemas/User');

// JWT Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('JWT verification error:', err);
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// POST: Create Teacher profile
router.post('/', authenticateToken, upload.single('profile_image'), async (req, res) => {
  try {
    console.log('Creating teacher profile...');
    console.log('Request body:', req.body);
    console.log('User from token:', req.user);
    
    const {
      user,
      address,
      gender,
      dateOfHire,
      subjects,
      dept_name,
      qualification,
      date_of_birth
    } = req.body;

    // Validate required fields
    if (!user || !address || !gender || !dateOfHire || !dept_name || !qualification || !date_of_birth) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['user', 'address', 'gender', 'dateOfHire', 'dept_name', 'qualification', 'date_of_birth']
      });
    }

    // Ensure user exists
    console.log('Checking if user exists:', user);
    const existingUser = await User.findById(user);
    if (!existingUser) {
      console.log('User not found:', user);
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('User found:', existingUser._id);

    // Check if Teacher model has the findOne method
    if (typeof Teacher.findOne !== 'function') {
      console.error('Teacher model does not have findOne method');
      console.log('Teacher model methods:', Object.getOwnPropertyNames(Teacher));
      return res.status(500).json({ message: 'Teacher model not properly initialized' });
    }

    // Prevent duplicate teacher profiles
    console.log('Checking for existing teacher profile...');
    const existingTeacher = await Teacher.findOne({ user: user });
    if (existingTeacher) {
      console.log('Teacher profile already exists for user:', user);
      return res.status(409).json({ message: 'Teacher profile already exists for this user' });
    }

    // Parse subjects if it's a string
    let parsedSubjects = [];
    if (subjects) {
      try {
        parsedSubjects = typeof subjects === 'string' ? JSON.parse(subjects) : subjects;
      } catch (e) {
        console.error('Error parsing subjects:', e);
        return res.status(400).json({ message: 'Invalid subjects format' });
      }
    }

    // Validate subjects array
    if (!Array.isArray(parsedSubjects) || parsedSubjects.length === 0) {
      return res.status(400).json({ message: 'At least one subject is required' });
    }

    // Create teacher data object
    const teacherData = {
      user: user,
      address: address.trim(),
      gender: gender,
      dateOfHire: new Date(dateOfHire),
      subjects: parsedSubjects,
      dept_name: dept_name.trim(),
      qualification: qualification.trim(),
      date_of_birth: new Date(date_of_birth)
    };

    // Add profile image if uploaded
    if (req.file) {
      console.log('Profile image uploaded:', req.file.originalname, req.file.size, 'bytes');
      teacherData.profile_image = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    console.log('Creating new teacher with data:', {
      ...teacherData,
      profile_image: teacherData.profile_image ? 'Image data present' : 'No image'
    });

    // Create and save new teacher profile
    const newTeacher = new Teacher(teacherData);
    const savedTeacher = await newTeacher.save();
    console.log('Teacher profile saved successfully:', savedTeacher._id);

    // Mark profile as complete on User model
    await User.findByIdAndUpdate(user, { profileComplete: true });
    console.log('User profile marked as complete');

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Teacher profile created successfully',
      data: {
        _id: savedTeacher._id,
        user: savedTeacher.user,
        address: savedTeacher.address,
        gender: savedTeacher.gender,
        dateOfHire: savedTeacher.dateOfHire,
        subjects: savedTeacher.subjects,
        dept_name: savedTeacher.dept_name,
        qualification: savedTeacher.qualification,
        date_of_birth: savedTeacher.date_of_birth,
        hasProfileImage: !!savedTeacher.profile_image,
        createdAt: savedTeacher.createdAt,
        updatedAt: savedTeacher.updatedAt
      }
    });

  } catch (error) {
    console.error('Teacher profile creation error:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: errors 
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'Invalid data format provided' 
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({ 
        message: 'Duplicate entry found' 
      });
    }

    // Generic error response
    res.status(500).json({ 
      message: 'Internal server error occurred while creating profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Please try again later'
    });
  }
});

// GET: Retrieve a teacher profile
router.get('/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).populate('user', 'fullName email');

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher profile not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: teacher._id,
        user: teacher.user,
        address: teacher.address,
        gender: teacher.gender,
        dateOfHire: teacher.dateOfHire,
        subjects: teacher.subjects,
        dept_name: teacher.dept_name,
        qualification: teacher.qualification,
        date_of_birth: teacher.date_of_birth,
        hasProfileImage: !!teacher.profile_image,
        createdAt: teacher.createdAt,
        updatedAt: teacher.updatedAt
      }
    });
  } catch (error) {
    console.error('Error fetching teacher profile:', error);
    res.status(500).json({ message: 'Error fetching teacher profile' });
  }
});

// GET: Profile image
router.get('/:id/profile-image', async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    
    if (!teacher || !teacher.profile_image || !teacher.profile_image.data) {
      return res.status(404).json({ message: 'Profile image not found' });
    }

    res.set('Content-Type', teacher.profile_image.contentType);
    res.set('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
    res.send(teacher.profile_image.data);
  } catch (error) {
    console.error('Error fetching profile image:', error);
    res.status(500).json({ message: 'Error fetching profile image' });
  }
});

// GET: Get teacher profile by user ID  
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ user: req.params.userId }).populate('user', 'fullName email');

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher profile not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: teacher._id,
        user: teacher.user,
        address: teacher.address,
        gender: teacher.gender,
        dateOfHire: teacher.dateOfHire,
        subjects: teacher.subjects,
        dept_name: teacher.dept_name,
        qualification: teacher.qualification,
        date_of_birth: teacher.date_of_birth,
        hasProfileImage: !!teacher.profile_image,
        createdAt: teacher.createdAt,
        updatedAt: teacher.updatedAt
      }
    });
  } catch (error) {
    console.error('Error fetching teacher profile by user ID:', error);
    res.status(500).json({ message: 'Error fetching teacher profile' });
  }
});

// PUT: Update teacher profile
router.put('/:id', authenticateToken, upload.single('profile_image'), async (req, res) => {
  try {
    const {
      address,
      gender,
      dateOfHire,
      subjects,
      dept_name,
      qualification,
      date_of_birth
    } = req.body;

    const updateData = {};
    
    if (address) updateData.address = address.trim();
    if (gender) updateData.gender = gender;
    if (dateOfHire) updateData.dateOfHire = new Date(dateOfHire);
    if (subjects) {
      const parsedSubjects = typeof subjects === 'string' ? JSON.parse(subjects) : subjects;
      updateData.subjects = parsedSubjects;
    }
    if (dept_name) updateData.dept_name = dept_name.trim();
    if (qualification) updateData.qualification = qualification.trim();
    if (date_of_birth) updateData.date_of_birth = new Date(date_of_birth);

    if (req.file) {
      updateData.profile_image = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedTeacher) {
      return res.status(404).json({ message: 'Teacher profile not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Teacher profile updated successfully',
      data: {
        _id: updatedTeacher._id,
        user: updatedTeacher.user,
        address: updatedTeacher.address,
        gender: updatedTeacher.gender,
        dateOfHire: updatedTeacher.dateOfHire,
        subjects: updatedTeacher.subjects,
        dept_name: updatedTeacher.dept_name,
        qualification: updatedTeacher.qualification,
        date_of_birth: updatedTeacher.date_of_birth,
        hasProfileImage: !!updatedTeacher.profile_image,
        updatedAt: updatedTeacher.updatedAt
      }
    });

  } catch (error) {
    console.error('Error updating teacher profile:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: errors 
      });
    }
    
    res.status(500).json({ message: 'Error updating teacher profile' });
  }
});

module.exports = router;