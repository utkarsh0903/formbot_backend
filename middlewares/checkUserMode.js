const Workspace = require("../models/workspace.models");


const checkUserMode = async (userId, activeWorkspace) => {
    if (!activeWorkspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }
    const isViewMode = activeWorkspace.sharedWith?.viewMode?.some((id) =>
      id.equals(userId)
    );
    if (isViewMode) {
      return res.status(400).json({
        message: "You are not allowed. View mode only",
      });
    }
}

module.exports = checkUserMode;