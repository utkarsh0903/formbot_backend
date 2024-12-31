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
      folderName: String,
      folderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folder",
      },
    },
  ],
  form: [
    {
      formName: String,
      formId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Form",
      },
    },
  ],
});

const Workspace = mongoose.model("Workspace", workspaceShema);

module.exports = Workspace;
