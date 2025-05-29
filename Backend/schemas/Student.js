import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
     user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
    address: { type: String },
    attendance: { type: Number, default: 0 },
    joinedPortals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Portal" }],
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
