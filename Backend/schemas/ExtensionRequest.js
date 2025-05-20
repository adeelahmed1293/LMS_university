// models/ExtensionRequest.js
const mongoose = require("mongoose");

const extensionRequestSchema = new mongoose.Schema({
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment" },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  proposedDate: Date,
  reason: String,
  status: { type: String, default: "Pending" }, // Approved/Rejected
});

module.exports = mongoose.model("ExtensionRequest", extensionRequestSchema);
