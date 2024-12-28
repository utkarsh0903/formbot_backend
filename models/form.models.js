const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
  formName: {
    type: String,
    required: true,
    unique: true,
  },
  formAccess: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
    },
  ],
  folder: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
    },
  ],
  content: [
    {
      type: String,
      enum: ["Bubbles", "Inputs"],
    },
  ],
});

const Form = mongoose.model("Form", formSchema);

module.exports = Form;
