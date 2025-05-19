import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String },
    attendance: { type: Number, default: 0 },
    joinedPortals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Portal" }],
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
