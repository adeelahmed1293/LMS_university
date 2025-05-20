// models/Quiz.js
const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: Number, // index of correct option
    },
  ],
});

module.exports = mongoose.model("Quiz", quizSchema);
