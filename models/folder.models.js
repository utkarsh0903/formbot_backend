const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema({
  folderName: {
    type: String,
    required: true,
    // unique: true,
  },
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

const Folder = mongoose.model("Folder", folderSchema);

module.exports = Folder;
