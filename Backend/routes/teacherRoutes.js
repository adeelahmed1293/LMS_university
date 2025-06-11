// routes/teacher_routes.js
import express from "express";
import Teacher from "../models/Teacher.js";

const router = express.Router();

// Create a new teacher
router.post("/", async (req, res) => {
  try {
    const newTeacher = new Teacher(req.body);
    const savedTeacher = await newTeacher.save();
    res.status(201).json(savedTeacher);
  } catch (error) {
    console.error("Failed to create teacher:", error);
    res.status(500).json({ message: "Failed to create teacher", error });
  }
});

// Get all teachers
router.get("/", async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (error) {
    console.error("Failed to fetch teachers:", error);
    res.status(500).json({ message: "Failed to get teachers", error });
  }
});

export default router;
