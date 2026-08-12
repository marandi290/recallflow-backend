const dataService = require("../services/dataService");
const asyncHandler = require("../middlewares/asyncHandler");

const exportData = asyncHandler(async (req, res) => {
    const userId = Number(req.query.user_id) || 1;
    const backupData = await dataService.exportUserData(userId);

    res.setHeader("Content-Disposition", `attachment; filename=recallflow-backup-${Date.now()}.json`);
    res.setHeader("Content-Type", "application/json");

    return res.status(200).json({
        success: true,
        message: "Data backup exported successfully",
        data: backupData,
    });
});

const importData = asyncHandler(async (req, res) => {
    const userId = Number(req.query.user_id) || 1;
    const result = await dataService.importUserData(userId, req.body);

    return res.status(200).json({
        success: true,
        message: "Data backup imported successfully",
        data: result,
    });
});

module.exports = {
    exportData,
    importData,
};
