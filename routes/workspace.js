const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const Workspace = require("../models/workspace.models");
const User = require("../models/user.models");

router.post("/create-workspace", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  try {
    let workspaces = await Workspace.find({
      $or: [
        { owner: userId },
        { "sharedWith.viewMode": userId },
        { "sharedWith.editMode": userId },
      ],
    }).populate("owner", "username");
    if (workspaces.length > 0) {
      return res.status(200).json({ workspace: workspaces });
    }
    const newWorkspace = await Workspace.findOneAndUpdate(
      { owner: userId },
      { owner: userId, folder: [], form: [] },
      { new: true, upsert: true }
    );
    workspaces = await newWorkspace.populate("owner", "username");

    return res.status(200).json({
      message: "Workspace created successfully",
      workspace: workspaces,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/:workSpaceId", async (req, res) => {
  const { workSpaceId } = req.params;
  const workspace = await Workspace.findById(workSpaceId);
  if (!workspace) {
    return res.status(400).json({ message: "No workspace found" });
  }
  res.status(200).json({ workspace });
});

router.put("/sharedWith/:workspaceId", authMiddleware, async (req, res) => {
  const { workspaceId } = req.params;
  const { email, mode } = req.body;

  try {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(400).json({ message: "Workspace not found" });
    }
    const user = await User.findOne({ email });
    console.log(user._id.toString());
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    if (mode === "view") {
      const checkInViewMode = workspace.sharedWith.viewMode.some((id) =>
        id.equals(user._id)
      );
      if (!checkInViewMode) {
        workspace.sharedWith.viewMode.push(user._id);
      } else {
        return res
          .status(400)
          .json({ message: "User is already in view mode" });
      }
    } else if (mode === "edit") {
      const checkInEditMode = workspace.sharedWith.editMode.some((id) =>
        id.equals(user._id)
      );
      if (!checkInEditMode) {
        workspace.sharedWith.editMode.push(user._id);
      } else {
        return res
          .status(400)
          .json({ message: "User is already in edit mode" });
      }
    } else {
      return res.status(400).json({ message: "Invalid mode provided" });
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
