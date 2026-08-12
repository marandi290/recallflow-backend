const notificationService = require("../services/notificationService");
const asyncHandler = require("../middlewares/asyncHandler");

const getUserNotifications = asyncHandler(async (req, res) => {
    const data = await notificationService.getUserNotifications(Number(req.query.user_id));

    return res.status(200).json({
        success: true,
        message: "Notifications fetched successfully",
        data,
    });
});

module.exports = {
    getUserNotifications,
};
