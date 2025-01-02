const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
  containerType: {
    type: String,
    enum: ["Bubbles", "Inputs"],
  },
  label: {
    type: String,
  },
  labelData: {
    type: String,
    default: () => "",
  },
});

const responseSchema = new mongoose.Schema([String]);

const formSchema = new mongoose.Schema({
  formName: {
    type: String,
    required: true,
  },
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
  },
  folder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder",
    default: null,
  },
  template: [templateSchema],
  responses: [responseSchema],
  visitCount: {
    type: Number,
    default: 0,
  },
  startCount: {
    type: Number,
    default: 0,
  },
  submittedCount: {
    type: Number,
    default: 0,
  },
});

const Form = mongoose.model("Form", formSchema);

module.exports = Form;
