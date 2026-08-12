const studyEntryService = require("../services/studyEntryService");
const asyncHandler = require("../middlewares/asyncHandler");

const createStudyEntry = asyncHandler(async (req, res) => {
    const studyEntry = await studyEntryService.createStudyEntry(req.body);

    return res.status(201).json({
        success: true,
        message: "Study entry created successfully",
        data: studyEntry,
    });
});

const getAllStudyEntries = asyncHandler(async (req, res) => {
    const studyEntries = await studyEntryService.getAllStudyEntries(Number(req.query.topic_id));

    return res.status(200).json({
        success: true,
        message: "Study entries fetched successfully",
        data: studyEntries,
    });
});

const getStudyEntryById = asyncHandler(async (req, res) => {
    const studyEntry = await studyEntryService.getStudyEntryById(Number(req.params.studyEntryId));

    return res.status(200).json({
        success: true,
        message: "Study entry fetched successfully",
        data: studyEntry,
    });
});

const updateStudyEntryById = asyncHandler(async (req, res) => {
    const studyEntry = await studyEntryService.updateStudyEntryById(
        Number(req.params.studyEntryId),
        req.body
    );

    return res.status(200).json({
        success: true,
        message: "Study entry updated successfully",
        data: studyEntry,
    });
});

const deleteStudyEntryById = asyncHandler(async (req, res) => {
    const studyEntry = await studyEntryService.deleteStudyEntryById(
        Number(req.params.studyEntryId)
    );

    return res.status(200).json({
        success: true,
        message: "Study entry deleted successfully",
        data: studyEntry,
    });
});

module.exports = {
    createStudyEntry,
    getAllStudyEntries,
    getStudyEntryById,
    updateStudyEntryById,
    deleteStudyEntryById,
};
