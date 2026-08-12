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

const getMonthCalendar = async (userId, year, month) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Last day of month

    const startDateStr = formatDateString(startDate);
    const endDateStr = formatDateString(endDate);

    const studyEntries = await StudyEntry.findAll({
        where: {
            study_date: {
                [Op.gte]: new Date(`${startDateStr}T00:00:00.000Z`),
                [Op.lte]: new Date(`${endDateStr}T23:59:59.999Z`),
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
        order: [["study_date", "ASC"]],
    });

    const revisions = await Revision.findAll({
        where: {
            revision_date: {
                [Op.gte]: startDateStr,
                [Op.lte]: endDateStr,
            },
        },
        include: [getIncludeHierarchy(userId)],
        order: [["revision_date", "ASC"]],
    });

    const daysMap = {};
    const curr = new Date(startDate);

    while (curr <= endDate) {
        const dateStr = formatDateString(curr);
        daysMap[dateStr] = {
            date: dateStr,
            studyEntriesCount: 0,
            studyMinutes: 0,
            revisionsCount: 0,
            completedRevisionsCount: 0,
            missedRevisionsCount: 0,
            pendingRevisionsCount: 0,
            studyEntries: [],
            revisions: [],
        };
        curr.setDate(curr.getDate() + 1);
    }

    for (const entry of studyEntries) {
        const dateStr = formatDateString(new Date(entry.study_date));
        if (daysMap[dateStr]) {
            daysMap[dateStr].studyEntriesCount++;
            daysMap[dateStr].studyMinutes += entry.duration_minutes || 0;
            daysMap[dateStr].studyEntries.push(entry);
        }
    }

    for (const rev of revisions) {
        const dateStr = rev.revision_date;
        if (daysMap[dateStr]) {
            daysMap[dateStr].revisionsCount++;
            if (rev.status === "completed") daysMap[dateStr].completedRevisionsCount++;
            else if (rev.status === "missed" || (rev.status === "pending" && dateStr < formatDateString(new Date()))) {
                daysMap[dateStr].missedRevisionsCount++;
            } else {
                daysMap[dateStr].pendingRevisionsCount++;
            }
            daysMap[dateStr].revisions.push(rev);
        }
    }

    return {
        year,
        month,
        startDate: startDateStr,
        endDate: endDateStr,
        days: Object.values(daysMap),
    };
};

module.exports = {
    getMonthCalendar,
};
