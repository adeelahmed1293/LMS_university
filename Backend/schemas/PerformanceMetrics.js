// models/Performance.js
const mongoose = require("mongoose");

const performanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  grade: String,
  progress: Number, // e.g., 70 for 70%
});

module.exports = mongoose.model("Performance", performanceSchema);
