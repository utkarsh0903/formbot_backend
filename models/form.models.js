const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ["Bubbles", "Inputs"],
  },
  subCategory: {
    type: String,
    enum: [
      "Bubble Text",
      "Bubble Image",
      "Text Input",
      "Number Input",
      "Email Input",
      "Phone Input",
      "Date Input",
      "Rating Input",
      "Submit Button",
    ],
  },
  label: {
    type: String,
  },
  labelData: {
    type: String,
    default: () => "",
  },
});

const dataSchema = new mongoose.Schema({
  textInput: { type: String },
  numberInput: { type: String },
  emailInput: { type: String },
  phoneInput: { type: String },
  dateInput: { type: String },
  ratingInput: { type: String },
});

const responseSchema = new mongoose.Schema({
  submittedAt: Date,
  username: String,
  email: String,
  data: [dataSchema]
});

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
