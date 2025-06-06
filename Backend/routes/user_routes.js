const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../schemas/User');
const Hod = require('../schemas/Hod');
const Teacher = require('../schemas/Teacher');
const Student = require('../schemas/Student');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/signup', async (req, res) => {
  const { fullName, email, password, confirmPassword, role, acceptedTerms } = req.body;

  if (!fullName || !email || !password || !confirmPassword || !role || acceptedTerms !== true) {
    return res.status(400).json({ message: 'Please fill all fields and agree to the terms.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: 'Email already registered.' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      role,
      acceptedTerms: true
    });

    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  
  // Validate input
  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Please fill in all fields (email, password, role).' });
  }

  try {
  
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email, password, or role.' });
      
    }


    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email, password, or role.' });
    }

    // Match role
    if (user.role !== role) {
      return res.status(403).json({ message: 'Access denied for selected role.' });
    }

    // Check if profile is complete based on role
    let profileComplete = false;
    let profileId = null;

    // FIX: Use correct query to find profile by user ID
    if (role === 'HOD') {
      const hodProfile = await Hod.findOne({ user: user._id });
      profileComplete = !!hodProfile;
      if (hodProfile) profileId = hodProfile._id;
    } else if (role === 'INSTRUCTOR') {
      const teacherProfile = await Teacher.findOne({ user: user._id });
      profileComplete = !!teacherProfile;
      if (teacherProfile) profileId = teacherProfile._id;
    } else if (role === 'STUDENT') {
      const studentProfile = await Student.findOne({ user: user._id });
      profileComplete = !!studentProfile;
      if (studentProfile) profileId = studentProfile._id;
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send response with token
    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profileComplete,
        profileId
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const {
    fullName,
    email,
    password,
    previousPassword,
    confirmPassword,
    role,
    acceptedTerms,
    profileComplete, // ✅ Added here
  } = req.body;
   console.log('the data of body is ',req.body);
  // Basic validations
  if (!fullName || !email || !role || acceptedTerms !== true) {
    return res.status(400).json({ message: 'Please provide fullName, email, role, and accept the terms.' });
  }

  // If user wants to change password, check confirmPassword and previousPassword
  if (password || confirmPassword || previousPassword) {
    if (!previousPassword) {
      return res.status(400).json({ message: 'Previous password is required to update password.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'New passwords do not match.' });
    }
  }

  try {
    // Find user
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    // Check previous password if password change is requested
    if (password && previousPassword) {
      const isMatch = await bcrypt.compare(previousPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Previous password is incorrect.' });
      }
    }

    // Check if email is changing and already taken
    if (email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'Email already in use.' });
      }
    }

    // Update user fields
    user.fullName = fullName;
    user.email = email;
    user.role = role;
    user.acceptedTerms = acceptedTerms;
    user.profileComplete = profileComplete; // ✅ Added here

    // Hash new password if it's being updated
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    return res.status(200).json({ message: 'User updated successfully.', user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
});


module.exports = router;