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

const getTodayDashboard = async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    const todayStr = getTodayDateString();
    const startOfToday = new Date(`${todayStr}T00:00:00.000Z`);
    const endOfToday = new Date(`${todayStr}T23:59:59.999Z`);

    const courseInclude = {
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
    };

    const todayStudyEntries = await StudyEntry.findAll({
        where: {
            study_date: {
                [Op.gte]: startOfToday,
                [Op.lte]: endOfToday,
            },
        },
        include: [courseInclude],
        order: [["study_date", "DESC"]],
    });

    const todayRevisions = await Revision.findAll({
        where: {
            revision_date: todayStr,
        },
        include: [
            {
                model: StudyEntry,
                as: "studyEntry",
                required: true,
                include: [courseInclude],
            },
        ],
        order: [["revision_date", "ASC"]],
    });

    const missedRevisionsCount = await Revision.count({
        where: {
            revision_date: { [Op.lt]: todayStr },
            status: { [Op.in]: ["pending", "missed"] },
        },
        include: [
            {
                model: StudyEntry,
                as: "studyEntry",
                required: true,
                include: [courseInclude],
            },
        ],
    });

    const upcomingRevisionsCount = await Revision.count({
        where: {
            revision_date: { [Op.gt]: todayStr },
            status: "pending",
        },
        include: [
            {
                model: StudyEntry,
                as: "studyEntry",
                required: true,
                include: [courseInclude],
            },
        ],
    });

    const pendingRevisionsCount = await Revision.count({
        where: {
            status: "pending",
        },
        include: [
            {
                model: StudyEntry,
                as: "studyEntry",
                required: true,
                include: [courseInclude],
            },
        ],
    });

    const dailyStudyTimeMinutes = todayStudyEntries.reduce(
        (sum, entry) => sum + (entry.duration_minutes || 0),
        0
    );

    return {
        todayStudyEntriesCount: todayStudyEntries.length,
        todayRevisionsCount: todayRevisions.length,
        pendingRevisionsCount,
        missedRevisionsCount,
        upcomingRevisionsCount,
        dailyStudyTimeMinutes,
        todayStudyEntries,
        todayRevisions,
    };
};

module.exports = {
    getTodayDashboard,
};
