

const checkUserMode = async (userId, activeWorkspace) => {
    try {
      if (!activeWorkspace) {
        return { status: 400, message: "Workspace not found" };
      }
      const isViewMode = activeWorkspace.sharedWith?.viewMode?.some((id) =>
        id.equals(userId)
      );
      if (isViewMode) {
        return {
          status: 400,
          message: "You are not allowed. View mode only",
        };
      }
      return {
        status: 200,
        message: "Allowed",
      };
    } catch (error) {
      return { status: 500, message: error.message };
    }
}

module.exports = checkUserMode;