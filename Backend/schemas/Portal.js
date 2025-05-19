import mongoose from "mongoose";

const portalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  portalId: { type: String, unique: true, required: true },
  subPortals: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubPortal" }],
});

export default mongoose.model("Portal", portalSchema);
