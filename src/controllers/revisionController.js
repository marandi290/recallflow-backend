const revisionService = require("../services/revisionService");
const asyncHandler = require("../middlewares/asyncHandler");

const getTodayRevisions = asyncHandler(async (req, res) => {
    const revisions = await revisionService.getTodayRevisions(Number(req.query.user_id));

    return res.status(200).json({
        success: true,
        message: "Today's revisions fetched successfully",
        data: revisions,
    });
});

const getUpcomingRevisions = asyncHandler(async (req, res) => {
    const revisions = await revisionService.getUpcomingRevisions(Number(req.query.user_id));

    return res.status(200).json({
        success: true,
        message: "Upcoming revisions fetched successfully",
        data: revisions,
    });
});

const getMissedRevisions = asyncHandler(async (req, res) => {
    const revisions = await revisionService.getMissedRevisions(Number(req.query.user_id));

    return res.status(200).json({
        success: true,
        message: "Missed revisions fetched successfully",
        data: revisions,
    });
});

const getRevisionById = asyncHandler(async (req, res) => {
    const revision = await revisionService.getRevisionById(Number(req.params.revisionId));

    return res.status(200).json({
        success: true,
        message: "Revision fetched successfully",
        data: revision,
    });
});

const completeRevision = asyncHandler(async (req, res) => {
    const revision = await revisionService.completeRevision(
        Number(req.params.revisionId),
        req.body
    );

    return res.status(200).json({
        success: true,
        message: "Revision marked as completed successfully",
        data: revision,
    });
});

module.exports = {
    getTodayRevisions,
    getUpcomingRevisions,
    getMissedRevisions,
    getRevisionById,
    completeRevision,
};
