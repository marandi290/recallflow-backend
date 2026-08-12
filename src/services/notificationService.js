const { Op } = require("sequelize");
const { User, Course, Topic, StudyEntry, Revision } = require("../models");
const ApiError = require("../utils/ApiError");
const httpStatus = require("../constants/httpStatus");

const formatDateString = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
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

const getUserNotifications = async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    const todayStr = formatDateString(new Date());

    const dueTodayRevisions = await Revision.findAll({
        where: {
            revision_date: todayStr,
            status: "pending",
        },
        include: [getIncludeHierarchy(userId)],
    });

    const missedRevisions = await Revision.findAll({
        where: {
            revision_date: { [Op.lt]: todayStr },
            status: { [Op.in]: ["pending", "missed"] },
        },
        include: [getIncludeHierarchy(userId)],
    });

    const startOfToday = new Date(`${todayStr}T00:00:00.000Z`);
    const endOfToday = new Date(`${todayStr}T23:59:59.999Z`);

    const todayStudyEntries = await StudyEntry.findAll({
        where: {
            study_date: {
                [Op.gte]: startOfToday,
                [Op.lte]: endOfToday,
            },
        },
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
    });

    const notifications = [];

    if (dueTodayRevisions.length > 0) {
        notifications.push({
            id: `due-today-${todayStr}`,
            type: "DUE_TODAY",
            severity: "info",
            title: "Revisions Due Today",
            message: `You have ${dueTodayRevisions.length} revision(s) scheduled for today.`,
            count: dueTodayRevisions.length,
            items: dueTodayRevisions,
        });
    }

    if (missedRevisions.length > 0) {
        notifications.push({
            id: `missed-${todayStr}`,
            type: "MISSED_REVISION",
            severity: "warning",
            title: "Overdue Revisions",
            message: `You have ${missedRevisions.length} overdue revision(s) that need attention.`,
            count: missedRevisions.length,
            items: missedRevisions,
        });
    }

    if (todayStudyEntries.length === 0) {
        notifications.push({
            id: `study-reminder-${todayStr}`,
            type: "STUDY_REMINDER",
            severity: "info",
            title: "Daily Study Reminder",
            message: "You haven't logged any study sessions today. Keep your streak alive!",
            count: 0,
            items: [],
        });
    }

    return {
        unreadCount: notifications.length,
        notifications,
    };
};

module.exports = {
    getUserNotifications,
};
