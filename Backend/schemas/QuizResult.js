// models/QuizResult.js
const mongoose = require("mongoose");

const quizResultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
  answers: [Number], // submitted answers
  score: Number,
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("QuizResult", quizResultSchema);
