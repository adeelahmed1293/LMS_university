const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../schemas/user');
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
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});



module.exports = router;
