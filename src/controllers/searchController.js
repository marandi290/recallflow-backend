const searchService = require("../services/searchService");
const asyncHandler = require("../middlewares/asyncHandler");

const searchAll = asyncHandler(async (req, res) => {
    const { user_id, q } = req.query;
    const searchData = await searchService.searchAll(Number(user_id), q);

    return res.status(200).json({
        success: true,
        message: "Search completed successfully",
        data: searchData,
    });
});

module.exports = {
    searchAll,
};
