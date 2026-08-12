const { Op } = require("sequelize");
const { User, Course, Topic, StudyEntry, Revision } = require("../models");
const ApiError = require("../utils/ApiError");
const httpStatus = require("../constants/httpStatus");

const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const getIncludeHierarchy = (userId) => {
    return {
        model: StudyEntry,
        as: "studyEntry",
        required: true,
        include: [
            {
                model: Topic,
                as: "topic",
                required: true,
                include: [
                    {
                        model: Course,
                        as: "course",
                        required: true,
                        where: { user_id: userId },
                    },
                ],
            },
        ],
    };
};

const getTodayRevisions = async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    const todayStr = getTodayDateString();

    return await Revision.findAll({
        where: {
            revision_date: todayStr,
            status: "pending",
        },
        include: [getIncludeHierarchy(userId)],
        order: [["revision_date", "ASC"]],
    });
};

const getUpcomingRevisions = async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    const todayStr = getTodayDateString();

    return await Revision.findAll({
        where: {
            revision_date: { [Op.gt]: todayStr },
            status: "pending",
        },
        include: [getIncludeHierarchy(userId)],
        order: [["revision_date", "ASC"]],
    });
};

const getMissedRevisions = async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    const todayStr = getTodayDateString();

    return await Revision.findAll({
        where: {
            revision_date: { [Op.lt]: todayStr },
            status: { [Op.in]: ["pending", "missed"] },
        },
        include: [getIncludeHierarchy(userId)],
        order: [["revision_date", "ASC"]],
    });
};

const getRevisionById = async (revisionId) => {
    const revision = await Revision.findByPk(revisionId, {
        include: [
            {
                model: StudyEntry,
                as: "studyEntry",
                include: [{ model: Topic, as: "topic" }],
            },
        ],
    });

    if (!revision) {
        throw new ApiError(httpStatus.NOT_FOUND, "Revision not found");
    }

    return revision;
};

const completeRevision = async (revisionId, completeData = {}) => {
    const revision = await Revision.findByPk(revisionId);

    if (!revision) {
        throw new ApiError(httpStatus.NOT_FOUND, "Revision not found");
    }

    revision.status = "completed";
    revision.completed_at = new Date();
    if (completeData.revision_notes !== undefined) {
        revision.revision_notes = completeData.revision_notes;
    }

    return await revision.save();
};

module.exports = {
    getTodayRevisions,
    getUpcomingRevisions,
    getMissedRevisions,
    getRevisionById,
    completeRevision,
};
