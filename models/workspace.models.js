const mongoose = require("mongoose");

const sharedUserSchema = new mongoose.Schema({
  viewMode: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  editMode: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const workspaceShema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  sharedWith: {
    type: sharedUserSchema,
    default: () => ({}),
  },
  folder: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
    },
  ],
});

const Workspace = mongoose.model("Workspace", workspaceShema);

module.exports = Workspace;
