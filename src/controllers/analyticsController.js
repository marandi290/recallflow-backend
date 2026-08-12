const analyticsService = require("../services/analyticsService");
const asyncHandler = require("../middlewares/asyncHandler");

const getOverview = asyncHandler(async (req, res) => {
    const data = await analyticsService.getOverview(Number(req.query.user_id));

    return res.status(200).json({
        success: true,
        message: "Analytics overview fetched successfully",
        data,
    });
});

const getWeekly = asyncHandler(async (req, res) => {
    const data = await analyticsService.getWeekly(Number(req.query.user_id));

    return res.status(200).json({
        success: true,
        message: "Weekly analytics fetched successfully",
        data,
    });
});

const getMonthly = asyncHandler(async (req, res) => {
    const data = await analyticsService.getMonthly(Number(req.query.user_id));

    return res.status(200).json({
        success: true,
        message: "Monthly analytics fetched successfully",
        data,
    });
});

module.exports = {
    getOverview,
    getWeekly,
    getMonthly,
};
