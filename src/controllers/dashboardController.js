const dashboardService = require("../services/dashboardService");
const asyncHandler = require("../middlewares/asyncHandler");

const getTodayDashboard = asyncHandler(async (req, res) => {
    const dashboardData = await dashboardService.getTodayDashboard(Number(req.query.user_id));

    return res.status(200).json({
        success: true,
        message: "Today's dashboard fetched successfully",
        data: dashboardData,
    });
});

module.exports = {
    getTodayDashboard,
};
