import express from "express";
import Portal from "../models/Portal.js";

const router = express.Router();

// Utility function to generate random 8-char alphanumeric ID
const generateShortId = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Create a new portal
router.post("/", async (req, res) => {
  try {
    const { name, description, portalId } = req.body;

    let finalPortalId = portalId;
    if (!finalPortalId) {
      // Generate unique short portalId
      let unique = false;
      let tries = 0;
      while (!unique && tries < 5) {
        finalPortalId = generateShortId();
        const existing = await Portal.findOne({ portalId: finalPortalId });
        if (!existing) unique = true;
        tries++;
      }
      if (!unique) {
        return res
          .status(500)
          .json({ message: "Failed to generate unique portalId" });
      }
    } else {
      const existing = await Portal.findOne({ portalId: finalPortalId });
      if (existing) {
        return res.status(400).json({ message: "Portal ID already exists" });
      }
    }

    const portal = new Portal({ name, description, portalId: finalPortalId });
    await portal.save();
    res.status(201).json(portal);
  } catch (err) {
    console.error("Create portal error:", err);
    res.status(500).json({ message: "Failed to create portal" });
  }
});

// Get all portals
router.get("/", async (req, res) => {
  try {
    const portals = await Portal.find().populate("subPortals");
    res.json(portals);
  } catch (err) {
    console.error("Get portals error:", err);
    res.status(500).json({ message: "Failed to fetch portals" });
  }
});

// Get a specific portal by ID
router.get("/:id", async (req, res) => {
  try {
    const portal = await Portal.findById(req.params.id).populate("subPortals");
    if (!portal) return res.status(404).json({ message: "Portal not found" });
    res.json(portal);
  } catch (err) {
    console.error("Get portal error:", err);
    res.status(500).json({ message: "Failed to fetch portal" });
  }
});

// Update a portal
router.put("/:id", async (req, res) => {
  try {
    const { name, description } = req.body;
    const portal = await Portal.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );
    if (!portal) return res.status(404).json({ message: "Portal not found" });
    res.json(portal);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Failed to update portal" });
  }
});

// Delete a portal
router.delete("/:id", async (req, res) => {
  try {
    const portal = await Portal.findByIdAndDelete(req.params.id);
    if (!portal) return res.status(404).json({ message: "Portal not found" });
    res.json({ message: "Portal deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Failed to delete portal" });
  }
});

export default router;
