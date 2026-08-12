const calendarService = require("../services/calendarService");
const asyncHandler = require("../middlewares/asyncHandler");

const getMonthCalendar = asyncHandler(async (req, res) => {
    const { user_id, year, month } = req.query;
    const calendarData = await calendarService.getMonthCalendar(
        Number(user_id),
        Number(year),
        Number(month)
    );

    return res.status(200).json({
        success: true,
        message: "Monthly calendar fetched successfully",
        data: calendarData,
    });
});

module.exports = {
    getMonthCalendar,
};
