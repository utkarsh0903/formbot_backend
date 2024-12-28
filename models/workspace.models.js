const mongoose = require("mongoose");

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
  form: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
    },
  ],
});

const Workspace = mongoose.model("Workspace", workspaceShema);

module.exports = Workspace;
