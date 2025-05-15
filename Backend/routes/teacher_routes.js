const express = require('express');
const router = express.Router();
const Teacher = require('../schemas/Teacher');
const Student = require('../schemas/Student');
const User = require('../schemas/User');
const Hod = require('../schemas/Hod');
const auth = require('../middleware/auth');
const checkProfile = require('../middleware/checkProfile');
const bcrypt = require('bcryptjs');

// Check if Teacher profile exists
router.get('/profile-status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'INSTRUCTOR') {
      return res.status(403).json({ message: 'Not authorized as Teacher' });
    }

    const teacherProfile = await Teacher.findOne({ userId: req.user.id });
    const isProfileComplete = !!teacherProfile && teacherProfile.profileComplete;

    return res.status(200).json({
      hasProfile: !!teacherProfile,
      isProfileComplete
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or update Teacher profile
router.post('/profile', auth, async (req, res) => {
  try {
    if (req.user.role !== 'INSTRUCTOR') {
      return res.status(403).json({ message: 'Not authorized as Teacher' });
    }

    const { 
      hodId, 
      department, 
      subjects, 
      contactNumber, 
      qualification 
    } = req.body;

    // Validate input
    if (!hodId || !department || !subjects || !contactNumber || !qualification) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    // Verify HOD exists
    const hodExists = await Hod.findById(hodId);
    if (!hodExists) {
      return res.status(404).json({ message: 'HOD not found' });
    }

    // Check if profile exists
    let teacherProfile = await Teacher.findOne({ userId: req.user.id });

    if (teacherProfile) {
      // Update existing profile
      teacherProfile.hodId = hodId;
      teacherProfile.department = department;
      teacherProfile.subjects = subjects;
      teacherProfile.contactNumber = contactNumber;
      teacherProfile.qualification = qualification;
      teacherProfile.profileComplete = true;

      await teacherProfile.save();
      return res.status(200).json({ message: 'Teacher profile updated successfully', profile: teacherProfile });
    } else {
      // Create new profile
      teacherProfile = new Teacher({
        userId: req.user.id,
        hodId,
        department,
        subjects,
        contactNumber,
        qualification,
        profileComplete: true
      });

      await teacherProfile.save();
      return res.status(201).json({ message: 'Teacher profile created successfully', profile: teacherProfile });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Teacher profile
router.get('/profile', auth, async (req, res) => {
  try {
    if (req.user.role !== 'INSTRUCTOR') {
      return res.status(403).json({ message: 'Not authorized as Teacher' });
    }

    const teacherProfile = await Teacher.findOne({ userId: req.user.id }).populate('hodId');
    
    if (!teacherProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    return res.status(200).json({ profile: teacherProfile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all HODs for teacher to select
router.get('/hods', auth, async (req, res) => {
  try {
    if (req.user.role !== 'INSTRUCTOR') {
      return res.status(403).json({ message: 'Not authorized as Teacher' });
    }

    const hods = await Hod.find().select('_id department');
    
    if (!hods || hods.length === 0) {
      return res.status(404).json({ message: 'No HODs found' });
    }

    return res.status(200).json({ hods });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Invite student
router.post('/invite-student', auth, checkProfile, async (req, res) => {
  try {
    if (req.user.role !== 'INSTRUCTOR') {
      return res.status(403).json({ message: 'Not authorized as Teacher' });
    }

    const { fullName, email, course, semester, batch } = req.body;

    // Validate input
    if (!fullName || !email || !course || !semester || !batch) {
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

    // Get Teacher profile
    const teacherProfile = await Teacher.findOne({ userId: req.user.id });
    if (!teacherProfile) {
      return res.status(404).json({ message: 'Teacher profile not found' });
    }

    // Create new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      role: 'STUDENT',
      acceptedTerms: true
    });

    await newUser.save();

    // Create student profile with minimal info, student will complete it later
    const rollNumber = `${course.substring(0, 3)}-${batch}-${Math.floor(1000 + Math.random() * 9000)}`;
    const studentProfile = new Student({
      userId: newUser._id,
      teacherId: teacherProfile._id,
      rollNumber,
      course,
      semester,
      batch,
      contactNumber: 'To be filled',
      dob: new Date(), // Default date, to be updated by student
      address: 'To be filled',
      guardianName: 'To be filled',
      guardianContact: 'To be filled',
      profileComplete: false
    });

    await studentProfile.save();

    // In a real-world application, you would send an email with the temporary password here

    return res.status(201).json({ 
      message: 'Student invited successfully. Temporary password generated.',
      tempPassword, // In a real app, you wouldn't return this, but would email it instead
      rollNumber
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all students under this teacher
router.get('/students', auth, checkProfile, async (req, res) => {
  try {
    if (req.user.role !== 'INSTRUCTOR') {
      return res.status(403).json({ message: 'Not authorized as Teacher' });
    }

    // Get Teacher profile
    const teacherProfile = await Teacher.findOne({ userId: req.user.id });
    if (!teacherProfile) {
      return res.status(404).json({ message: 'Teacher profile not found' });
    }

    // Get all students under this teacher
    const students = await Student.find({ teacherId: teacherProfile._id })
      .populate('userId', 'fullName email');
    
    if (!students || students.length === 0) {
      return res.status(404).json({ message: 'No students found under this teacher' });
    }

    return res.status(200).json({ students });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 