const express = require("express");
const authMiddleware = require("../middlewares/auth");
const Folder = require("../models/folder.models");
const Workspace = require("../models/workspace.models");
const checkUserMode = require("../middlewares/checkUserMode");
const router = express.Router();

router.post("/create-folder", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { folderName, activeWorkspaceId } = req.body;
  if (!folderName || !activeWorkspaceId) {
    return res.status(400).json({ message: "Missing credentials" });
  }
  try {
    const activeWorkspace = await Workspace.findById(activeWorkspaceId);
    checkUserMode(userId, activeWorkspace);
    const isFolderNameUnique = activeWorkspace.folder.some(
      (folder) => folder.folderName === folderName
    );
    if (isFolderNameUnique) {
      return res.status(400).json({ message: "Folder name should be unique" });
    }
    const newFolder = await Folder.create({
      folderName,
      form: [],
    });

    activeWorkspace.folder.push({ folderName, folderId: newFolder._id });
    await activeWorkspace.save();
    return res.status(200).json({
      message: "Folder created successfully",
      folder: newFolder,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.delete("/delete-folder", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { folderName, activeWorkspaceId } = req.body;
  if (!folderName || !activeWorkspaceId) {
    return res.status(400).json({ message: "Missing credentials" });
  }
  try {
    const activeWorkspace = await Workspace.findById(activeWorkspaceId);
    checkUserMode(userId, activeWorkspace);
    const folderDetails = activeWorkspace.folder.find(
      (folder) => folder.folderName === folderName
    );
    if (!folderDetails) {
      return res.status(400).json({ message: "Folder not found" });
    }
    const deleteFolderId = folderDetails.folderId;
    await Folder.findByIdAndDelete(deleteFolderId);
    activeWorkspace.folder = activeWorkspace.folder.filter(
      (folder) => !folder.folderId.equals(deleteFolderId)
    );
    await activeWorkspace.save();
    return res.status(200).json({
      message: "Folder deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
