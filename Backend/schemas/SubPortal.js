import mongoose from "mongoose";

const subPortalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: {
    type: String,
    enum: ["quiz", "assignment", "lecture"],
    required: true,
  },
  fileUrl: { type: String },
  portal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Portal",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.SubPortal ||
  mongoose.model("SubPortal", subPortalSchema);
