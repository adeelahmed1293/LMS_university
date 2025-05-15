const express = require('express');
const router = express.Router();
const Hod = require('../schemas/Hod');
const User = require('../schemas/User');
const Teacher = require('../schemas/Teacher');
const auth = require('../middleware/auth');
const checkProfile = require('../middleware/checkProfile');
const bcrypt = require('bcryptjs');

// Check if HOD profile exists
router.get('/profile-status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'HOD') {
      return res.status(403).json({ message: 'Not authorized as HOD' });
    }

    const hodProfile = await Hod.findOne({ userId: req.user.id });
    const isProfileComplete = !!hodProfile && hodProfile.profileComplete;

    return res.status(200).json({
      hasProfile: !!hodProfile,
      isProfileComplete
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or update HOD profile
router.post('/profile', auth, async (req, res) => {
  try {
    if (req.user.role !== 'HOD') {
      return res.status(403).json({ message: 'Not authorized as HOD' });
    }

    const { department, contactNumber } = req.body;

    // Validate input
    if (!department || !contactNumber) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    // Check if profile exists
    let hodProfile = await Hod.findOne({ userId: req.user.id });

    if (hodProfile) {
      // Update existing profile
      hodProfile.department = department;
      hodProfile.contactNumber = contactNumber;
      hodProfile.profileComplete = true;

      await hodProfile.save();
      return res.status(200).json({ message: 'HOD profile updated successfully', profile: hodProfile });
    } else {
      // Create new profile
      hodProfile = new Hod({
        userId: req.user.id,
        department,
        contactNumber,
        profileComplete: true
      });

      await hodProfile.save();
      return res.status(201).json({ message: 'HOD profile created successfully', profile: hodProfile });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get HOD profile
router.get('/profile', auth, async (req, res) => {
  try {
    if (req.user.role !== 'HOD') {
      return res.status(403).json({ message: 'Not authorized as HOD' });
    }

    const hodProfile = await Hod.findOne({ userId: req.user.id });
    
    if (!hodProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    return res.status(200).json({ profile: hodProfile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Invite teacher
router.post('/invite-teacher', auth, checkProfile, async (req, res) => {
  try {
    if (req.user.role !== 'HOD') {
      return res.status(403).json({ message: 'Not authorized as HOD' });
    }

    const { fullName, email, department } = req.body;

    // Validate input
    if (!fullName || !email || !department) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(tempPassword, salt);

    // Get HOD profile
    const hodProfile = await Hod.findOne({ userId: req.user.id });
    if (!hodProfile) {
      return res.status(404).json({ message: 'HOD profile not found' });
    }

    // Create new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      role: 'INSTRUCTOR',
      acceptedTerms: true
    });

    await newUser.save();

    // Create teacher profile with minimal info, teacher will complete it later
    const teacherProfile = new Teacher({
      userId: newUser._id,
      hodId: hodProfile._id,
      department,
      subjects: ['To be filled'],
      contactNumber: 'To be filled',
      qualification: 'To be filled',
      profileComplete: false
    });

    await teacherProfile.save();

    // In a real-world application, you would send an email with the temporary password here

    return res.status(201).json({ 
      message: 'Teacher invited successfully. Temporary password generated.',
      tempPassword // In a real app, you wouldn't return this, but would email it instead
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all teachers under this HOD
router.get('/teachers', auth, checkProfile, async (req, res) => {
  try {
    if (req.user.role !== 'HOD') {
      return res.status(403).json({ message: 'Not authorized as HOD' });
    }

    // Get HOD profile
    const hodProfile = await Hod.findOne({ userId: req.user.id });
    if (!hodProfile) {
      return res.status(404).json({ message: 'HOD profile not found' });
    }

    // Get all teachers under this HOD
    const teachers = await Teacher.find({ hodId: hodProfile._id })
      .populate('userId', 'fullName email');
    
    if (!teachers || teachers.length === 0) {
      return res.status(404).json({ message: 'No teachers found under this HOD' });
    }

    return res.status(200).json({ teachers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 