const { Topic, Course, StudyEntry, Revision } = require("../models");
const ApiError = require("../utils/ApiError");
const httpStatus = require("../constants/httpStatus");
const { calculateRevisionDates } = require("../utils/scheduler");

const createStudyEntry = async (entryData) => {
    const topic = await Topic.findByPk(entryData.topic_id, {
        include: [{ model: Course, as: "course" }],
    });
    if (!topic) {
        throw new ApiError(httpStatus.NOT_FOUND, "Topic not found");
    }

    const studyEntry = await StudyEntry.create(entryData);

    const algorithm = (topic.course && topic.course.algorithm) || "three_month";
    const revisionItems = calculateRevisionDates(studyEntry.study_date, algorithm);

    const revisionRecords = revisionItems.map((item) => ({
        ...item,
        study_entry_id: studyEntry.id,
    }));

    const revisions = await Revision.bulkCreate(revisionRecords);

    return {
        ...studyEntry.toJSON(),
        revisions,
    };
};

const getAllStudyEntries = async (topicId) => {
    const topic = await Topic.findByPk(topicId);
    if (!topic) {
        throw new ApiError(httpStatus.NOT_FOUND, "Topic not found");
    }

    return await StudyEntry.findAll({
        where: {
            topic_id: topicId,
        },
        order: [["study_date", "DESC"]],
    });
};

const getStudyEntryById = async (studyEntryId) => {
    const studyEntry = await StudyEntry.findByPk(studyEntryId);
    if (!studyEntry) {
        throw new ApiError(httpStatus.NOT_FOUND, "Study entry not found");
    }

    return studyEntry;
};

const updateStudyEntryById = async (studyEntryId, updateData) => {
    const studyEntry = await StudyEntry.findByPk(studyEntryId);
    if (!studyEntry) {
        throw new ApiError(httpStatus.NOT_FOUND, "Study entry not found");
    }

    Object.assign(studyEntry, updateData);
    return await studyEntry.save();
};

const deleteStudyEntryById = async (studyEntryId) => {
    const studyEntry = await StudyEntry.findByPk(studyEntryId);
    if (!studyEntry) {
        throw new ApiError(httpStatus.NOT_FOUND, "Study entry not found");
    }

    await studyEntry.destroy();
    return studyEntry;
};

module.exports = {
    createStudyEntry,
    getAllStudyEntries,
    getStudyEntryById,
    updateStudyEntryById,
    deleteStudyEntryById,
};
