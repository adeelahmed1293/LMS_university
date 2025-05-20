const express = require('express');
const router = express.Router();
const Course = require('../schemas/course'); // Make sure this path matches your folder structure

router.get('/student', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
