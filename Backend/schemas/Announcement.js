import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    portal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Portal",
      required: true,
    },
    message: { type: String, required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
  },
  { timestamps: true }
);

export default mongoose.model("Announcement", announcementSchema);
