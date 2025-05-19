import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    surname: { type: String },
    phoneno: { type: String },
    address: { type: String },
    image: { type: String }, // image URL or filename
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    dateOfHire: { type: Date },
    subjects: [{ type: String }],
    dept_name: { type: String },
    email: { type: String, required: true, unique: true },
    createdPortals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Portal" }],
  },
  { timestamps: true }
);

export default mongoose.model("Teacher", teacherSchema);
