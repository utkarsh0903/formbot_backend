const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const Workspace = require("../models/workspace.models");
const { findOne } = require("../models/user.models");

router.post("/create-workspace", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  try {
    const workspace = await Workspace.$wherefindOne({ owner: userId });
    if (workspace) {
      return res.status(200).json(isWorkspaceExist);
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
  const id = req.params;
  const workspace = await Workspace.find({ id });
  if (!workspace) {
    return res.status(400).json({ message: "No workspace found" });
  }
  res.status(200).json(workspace);
});

// router.post("/create-folder", (req, res) => {
//     const {folderName} = req.body;
//     if(!folderName){
//         return res.status(400).json({message: "Folder Name is required"});
//     }

// })

module.exports = router;
