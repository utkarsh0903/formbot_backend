const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema({
  folderName: {
    type: String,
    required: true,
    unique: true,
  },
  folderAccess: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
    },
  ],
  form: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
    },
  ]
});

const Folder = mongoose.model("Folder", folderSchema);

module.exports = Folder;
