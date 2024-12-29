const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const Workspace = require("../models/workspace.models");
const { findOne } = require("../models/user.models");
const User = require("../models/user.models");

router.post("/create-workspace", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  try {
    const workspace = await Workspace.findOne({ owner: userId });
    if (workspace) {
      return res.status(200).json(workspace);
    }
    const newWorkspace = await Workspace.create({
      owner: userId,
      folder: [],
      form: [],
    });
    return res
      .status(200)
      .json({ message: "Workspace created successfully", newWorkspace });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const workspace = await Workspace.findById(id);
  if (!workspace) {
    return res.status(400).json({ message: "No workspace found" });
  }
  res.status(200).json(workspace);
});

router.put("/sharedWith/:workspaceId", authMiddleware, async (req, res) => {
  const { workspaceId } = req.params;
  const { userId, mode } = req.body;

  try {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    if (mode === "view") {
      if (!workspace.sharedWith.viewMode.includes(userId)) {
        workspace.sharedWith.viewMode.push(userId);
      }
    } else if (mode === "edit") {
      if (!workspace.sharedWith.editMode.includes(userId)) {
        workspace.sharedWith.editMode.push(userId);
      }
    } else {
      return res.status(400).json({ message: "User can access already" });
    }

    await workspace.save();

    return res.status(200).json({
      message: `User added to ${mode} mode successfully`,
      workspace,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while adding the user",
      error: error.message,
    });
  }
});

// router.post("/create-folder", (req, res) => {
//     const {folderName} = req.body;
//     if(!folderName){
//         return res.status(400).json({message: "Folder Name is required"});
//     }

// })

module.exports = router;
