const express = require("express");
const checkUserMode = require("../middlewares/checkUserMode");
const authMiddleware = require("../middlewares/auth");
const Folder = require("../models/folder.models");
const Form = require("../models/form.models");
const Workspace = require("../models/workspace.models");
const router = express.Router();

router.get("/:formId", authMiddleware, async (req, res) => {
  try {
    const { formId } = req.params;
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(400).json({ message: "Form not found" });
    }
    res.status(200).json(form);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/:formId/formbot", async (req, res) => {
    try {
      const { formId } = req.params;
      const form = await Form.findById(formId);
      if (!form) {
        return res.status(400).json({ message: "Form not found" });
      }
      res.status(200).json(form);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });

router.post("/create-form", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { formName, activeWorkspaceId } = req.body;
  if (!formName || !activeWorkspaceId) {
    return res.status(400).json({ message: "Missing credentials" });
  }
  try {
    const activeWorkspace = await Workspace.findById(activeWorkspaceId);
    const result = await checkUserMode(userId, activeWorkspace);

    if (result.status !== 200) {
      return res.status(result.status).json({ message: result.message });
    }
    const isFormNameUnique = activeWorkspace.form.some(
      (form) => form.formName === formName
    );
    if (isFormNameUnique) {
      return res.status(400).json({ message: "Form name should be unique" });
    }
    const newForm = await Form.create({
      formName,
      workspace: activeWorkspaceId,
    });

    activeWorkspace.form.push({ formName, formId: newForm._id });
    await activeWorkspace.save();
    return res.status(200).json({
      message: "Form created successfully",
      form: newForm,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/folder/create-form", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { formName, activeWorkspaceId, activeFolderId } = req.body;
  if (!formName || !activeWorkspaceId || !activeFolderId) {
    return res.status(400).json({ message: "Missing credentials" });
  }
  try {
    const activeWorkspace = await Workspace.findById(activeWorkspaceId);
    const result = await checkUserMode(userId, activeWorkspace);

    if (result.status !== 200) {
      return res.status(result.status).json({ message: result.message });
    }
    const activeFolder = await Folder.findById(activeFolderId);
    const isFormNameUnique = activeFolder.form.some(
      (form) => form.formName === formName
    );
    if (isFormNameUnique) {
      return res.status(400).json({ message: "Form name should be unique" });
    }
    const newForm = await Form.create({
      formName,
      workspace: activeWorkspaceId,
      folder: activeFolderId,
    });

    activeFolder.form.push({ formName, formId: newForm._id });
    await activeFolder.save();
    return res.status(200).json({
      message: "Form created successfully",
      form: newForm,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.delete("/delete-form", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { formName, activeWorkspaceId } = req.body;
  if (!formName || !activeWorkspaceId) {
    return res.status(400).json({ message: "Missing credentials" });
  }
  try {
    const activeWorkspace = await Workspace.findById(activeWorkspaceId);
    checkUserMode(userId, activeWorkspace);
    const formDetails = activeWorkspace.form.find(
      (form) => form.formName === formName
    );
    if (!formDetails) {
      return res.status(400).json({ message: "Form not found" });
    }
    const deleteFormId = formDetails.formId;
    await Form.findByIdAndDelete(deleteFormId);
    activeWorkspace.form = activeWorkspace.form.filter(
      (form) => !form.formId.equals(deleteFormId)
    );
    await activeWorkspace.save();
    return res.status(200).json({
      message: "Form deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.delete("/folder/delete-form", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { formName, activeWorkspaceId, activeFolderId } = req.body;
  if (!formName || !activeWorkspaceId || !activeFolderId) {
    return res.status(400).json({ message: "Missing credentials" });
  }
  try {
    const activeWorkspace = await Workspace.findById(activeWorkspaceId);
    checkUserMode(userId, activeWorkspace);
    const activeFolder = await Folder.findById(activeFolderId);
    const formDetails = activeFolder.form.find(
      (form) => form.formName === formName
    );
    if (!formDetails) {
      return res.status(400).json({ message: "Form not found" });
    }
    const deleteFormId = formDetails.formId;
    await Form.findByIdAndDelete(deleteFormId);
    activeFolder.form = activeFolder.form.filter(
      (form) => !form.formId.equals(deleteFormId)
    );
    await activeFolder.save();
    return res.status(200).json({
      message: "Form deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/form-content/:formId", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { formId } = req.params;
  const { formTemplate } = req.body;
  if (!formTemplate) {
    return res.status(400).json({ message: "Missing Template" });
  }
  try {
    let activeForm = await Form.findById(formId);
    if (!activeForm) return res.status(400).json({ message: "Form not found" });

    let newFormTemplate = [];
    formTemplate.forEach(({ category, subCategory, label, labelData }) => {
      const newFormTemplateData = {
        category,
        subCategory,
        label,
        labelData: labelData || "",
      };
      newFormTemplate.push(newFormTemplateData);
    });
    activeForm.template = newFormTemplate;
    await activeForm.save();
    return res.status(200).json({
      message: "Form created successfully",
      form: activeForm,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/responses/:formId", async (req, res) => {
  const { formId } = req.params;
  const { userResponses } = req.body;
  if (
    !userResponses ||
    !userResponses.username ||
    !userResponses.email ||
    !userResponses.userData
  ) {
    return res.status(400).json({ message: "Incomplete Data" });
  }
  try {
    let activeForm = await Form.findById(formId);
    if (!activeForm) return res.status(400).json({ message: "Form not found" });

    activeForm.responses.push({
      submittedAt: new Date(),
      username: userResponses.username,
      email: userResponses.email,
      data: userResponses.userData,
    });

    await activeForm.save();
    return res.status(200).json({
      message: "Form created successfully",
      form: activeForm,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/responses/count/:formId", async (req, res) => {
  const { formId } = req.params;
  const { counts } = req.body;
  if (!formId || !counts) {
    return res
      .status(400)
      .json({ message: "Form ID and counts are required." });
  }
  try {
    const activeForm = await Form.findByIdAndUpdate(
      formId,
      {
        visitCount: counts.visitCount,
        startCount: counts.startCount,
        submittedCount: counts.submittedCount,
      },
      { new: true }
    );

    if (!activeForm) {
      return res.status(404).json({ message: "Form not found." });
    }

    await activeForm.save();
    return res.status(200).json({
      visitCount: activeForm.visitCount,
      startCount: activeForm.startCount,
      submittedCount: activeForm.submittedCount,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/:formId/responses", authMiddleware, async (req, res) => {
    try {
      const { formId } = req.params;
      const form = await Form.findById(formId);
      if (!form) {
        return res.status(400).json({ message: "Form not found" });
      }
      res.status(200).json(form);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });


module.exports = router;
