import express from "express";
import multer from "multer";
import SubPortal from "../models/SubPortal.js";
import Portal from "../models/Portal.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create Sub-Portal (single file upload named "file", can be changed to upload.array if needed)
router.post("/", upload.array("files"), async (req, res) => {
  try {
    const { title, type, description, portalId } = req.body;
    if (!portalId)
      return res.status(400).json({ message: "Portal ID is required" });

    // Map multer files to file schema
    const files = req.files
      ? req.files.map((file) => ({
          data: file.buffer,
          contentType: file.mimetype,
          filename: file.originalname,
        }))
      : [];

    const subPortal = new SubPortal({
      title,
      type,
      description,
      portal: portalId,
      files,
    });

    await subPortal.save();

    await Portal.findByIdAndUpdate(portalId, {
      $push: { subPortals: subPortal._id },
    });

    res.status(201).json(subPortal);
  } catch (err) {
    console.error("Create SubPortal error:", err);
    res.status(500).json({ message: "Create failed" });
  }
});

// Get Sub-Portal by ID (with files)
router.get("/:id", async (req, res) => {
  try {
    const subPortal = await SubPortal.findById(req.params.id).populate(
      "portal"
    );
    if (!subPortal)
      return res.status(404).json({ message: "SubPortal not found" });
    res.status(200).json(subPortal);
  } catch (err) {
    console.error("Fetch SubPortal error:", err);
    res.status(500).json({ message: "Fetch failed" });
  }
});

// Serve specific file from a subPortal by file ID
router.get("/:subPortalId/file/:fileId", async (req, res) => {
  try {
    const { subPortalId, fileId } = req.params;
    const subPortal = await SubPortal.findById(subPortalId);
    if (!subPortal)
      return res.status(404).json({ message: "SubPortal not found" });

    // Find file inside files array by _id
    const file = subPortal.files.id(fileId);
    if (!file) return res.status(404).json({ message: "File not found" });

    res.set("Content-Type", file.contentType);
    res.set("Content-Disposition", `inline; filename="${file.filename}"`);
    res.send(file.data);
  } catch (err) {
    console.error("Serve file error:", err);
    res.status(500).json({ message: "Serve file failed" });
  }
});

// Update Sub-Portal (title, type, description, add files)
router.put("/:id", upload.array("files"), async (req, res) => {
  try {
    const { title, type, description } = req.body;

    const updateFields = { title, type, description };

    if (req.files && req.files.length > 0) {
      // Add new files to existing ones instead of replacing:
      const subPortal = await SubPortal.findById(req.params.id);
      if (!subPortal)
        return res.status(404).json({ message: "SubPortal not found" });

      const newFiles = req.files.map((file) => ({
        data: file.buffer,
        contentType: file.mimetype,
        filename: file.originalname,
      }));

      subPortal.files.push(...newFiles);

      // Update other fields:
      if (title) subPortal.title = title;
      if (type) subPortal.type = type;
      if (description) subPortal.description = description;

      await subPortal.save();
      return res.json(subPortal);
    } else {
      // No files uploaded, just update text fields
      const updated = await SubPortal.findByIdAndUpdate(
        req.params.id,
        updateFields,
        { new: true }
      );
      if (!updated)
        return res.status(404).json({ message: "SubPortal not found" });
      res.json(updated);
    }
  } catch (err) {
    console.error("Update SubPortal error:", err);
    res.status(500).json({ message: "Update failed" });
  }
});

// Delete Sub-Portal (and remove from portal's subPortals array)
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await SubPortal.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "SubPortal not found" });

    await Portal.findByIdAndUpdate(deleted.portal, {
      $pull: { subPortals: deleted._id },
    });

    res.json({ message: "SubPortal deleted" });
  } catch (err) {
    console.error("Delete SubPortal error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;
