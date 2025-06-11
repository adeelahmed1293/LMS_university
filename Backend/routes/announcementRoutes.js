import express from "express";
import Announcement from "../models/Announcement.js";

const router = express.Router();

// Create a new announcement
router.post("/", async (req, res) => {
  try {
    const newAnnouncement = new Announcement(req.body);
    const saved = await newAnnouncement.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: "Failed to create announcement", error });
  }
});

// Get all announcements for a specific portal
router.get("/:portalId", async (req, res) => {
  try {
    const portalId = req.params.portalId;
    const announcements = await Announcement.find({ portal: portalId });
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch announcements", error });
  }
});

export default router;
