const express = require("express");
const authMiddleware = require("../middlewares/auth");
const Folder = require("../models/folder.models");
const Workspace = require("../models/workspace.models");
const router = express.Router();

router.post("/create-folder", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { folderName, activeWorkspaceId } = req.body;
  try {
    const activeWorkspace = await Workspace.findById(activeWorkspaceId);
    if (!activeWorkspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }
    const isViewMode = activeWorkspace.sharedWith?.viewMode?.some((id) =>
      id.equals(userId)
    );
    if (isViewMode) {
      return res.status(400).json({
        message: "You are not allowed to create folder. View mode only",
      });
    }
    const newFolder = await Folder.create({
      folderName,
      form: [],
      workspace: activeWorkspace._id,
    });
    return res.status(200).json({
      message: "Folder created successfully",
      folder: newFolder,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
