const express = require('express');
const router = express.Router();
const Student = require('../schemas/Student');
const Teacher = require('../schemas/Teacher');
const auth = require('../middleware/auth');

// Check if Student profile exists
router.get('/profile-status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'STUDENT') {
      return res.status(403).json({ message: 'Not authorized as Student' });
    }

    const studentProfile = await Student.findOne({ userId: req.user.id });
    const isProfileComplete = !!studentProfile && studentProfile.profileComplete;

    return res.status(200).json({
      hasProfile: !!studentProfile,
      isProfileComplete
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or update Student profile
router.post('/profile', auth, async (req, res) => {
  try {
    if (req.user.role !== 'STUDENT') {
      return res.status(403).json({ message: 'Not authorized as Student' });
    }

    const { 
      teacherId, 
      rollNumber, 
      course, 
      semester,
      batch,
      contactNumber,
      dob,
      address,
      guardianName,
      guardianContact
    } = req.body;

    // Validate input
    if (!teacherId || !rollNumber || !course || !semester || !batch || !contactNumber || 
        !dob || !address || !guardianName || !guardianContact) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    // Verify Teacher exists
    const teacherExists = await Teacher.findById(teacherId);
    if (!teacherExists) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Check if profile exists
    let studentProfile = await Student.findOne({ userId: req.user.id });

    if (studentProfile) {
      // Update existing profile
      studentProfile.teacherId = teacherId;
      studentProfile.rollNumber = rollNumber;
      studentProfile.course = course;
      studentProfile.semester = semester;
      studentProfile.batch = batch;
      studentProfile.contactNumber = contactNumber;
      studentProfile.dob = dob;
      studentProfile.address = address;
      studentProfile.guardianName = guardianName;
      studentProfile.guardianContact = guardianContact;
      studentProfile.profileComplete = true;

      await studentProfile.save();
      return res.status(200).json({ message: 'Student profile updated successfully', profile: studentProfile });
    } else {
      // Create new profile
      studentProfile = new Student({
        userId: req.user.id,
        teacherId,
        rollNumber,
        course,
        semester,
        batch,
        contactNumber,
        dob,
        address,
        guardianName,
        guardianContact,
        profileComplete: true
      });

      await studentProfile.save();
      return res.status(201).json({ message: 'Student profile created successfully', profile: studentProfile });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Student profile
router.get('/profile', auth, async (req, res) => {
  try {
    if (req.user.role !== 'STUDENT') {
      return res.status(403).json({ message: 'Not authorized as Student' });
    }

    const studentProfile = await Student.findOne({ userId: req.user.id }).populate('teacherId');
    
    if (!studentProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    return res.status(200).json({ profile: studentProfile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all Teachers for student to select
router.get('/teachers', auth, async (req, res) => {
  try {
    if (req.user.role !== 'STUDENT') {
      return res.status(403).json({ message: 'Not authorized as Student' });
    }

    const teachers = await Teacher.find().select('_id department designation subjects facultyId');
    
    if (!teachers || teachers.length === 0) {
      return res.status(404).json({ message: 'No Teachers found' });
    }

    return res.status(200).json({ teachers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 