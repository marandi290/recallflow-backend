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

const getTodayDateString = () => formatDateString(new Date());

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

const calculateLearningStreak = (studyDatesStrSet) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = 0;
    let checkDate = new Date(today);

    // Check if today has a study entry
    const todayStr = formatDateString(checkDate);
    let hasStudyToday = studyDatesStrSet.has(todayStr);

    if (!hasStudyToday) {
        // If not today, check yesterday to see if active streak carries over
        checkDate.setDate(checkDate.getDate() - 1);
        const yesterdayStr = formatDateString(checkDate);
        if (!studyDatesStrSet.has(yesterdayStr)) {
            return 0;
        }
    }

    // Count consecutive active days
    while (studyDatesStrSet.has(formatDateString(checkDate))) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
    }

    return streak;
};

const getOverview = async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    const todayStr = getTodayDateString();

    const totalCourses = await Course.count({ where: { user_id: userId } });
    const completedCourses = await Course.count({
        where: { user_id: userId, status: "completed" },
    });

    const totalTopics = await Topic.count({
        include: [
            {
                model: Course,
                as: "course",
                required: true,
                where: { user_id: userId },
            },
        ],
    });

    const studyEntries = await StudyEntry.findAll({
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

    const totalStudyMinutes = studyEntries.reduce(
        (sum, entry) => sum + (entry.duration_minutes || 0),
        0
    );
    const totalStudyHours = Number((totalStudyMinutes / 60).toFixed(2));

    const studyDatesStrSet = new Set(
        studyEntries.map((e) => formatDateString(new Date(e.study_date)))
    );
    const learningStreakDays = calculateLearningStreak(studyDatesStrSet);

    const pastRevisions = await Revision.findAll({
        where: {
            revision_date: { [Op.lte]: todayStr },
        },
        include: [getIncludeHierarchy(userId)],
    });

    const totalPastRevisionsCount = pastRevisions.length;
    const completedRevisionsCount = pastRevisions.filter(
        (r) => r.status === "completed"
    ).length;
    const missedRevisionsCount = pastRevisions.filter(
        (r) => r.status === "missed" || (r.status === "pending" && r.revision_date < todayStr)
    ).length;

    const revisionCompletionRate =
        totalPastRevisionsCount > 0
            ? Number(((completedRevisionsCount / totalPastRevisionsCount) * 100).toFixed(2))
            : 0;

    const missedRevisionRate =
        totalPastRevisionsCount > 0
            ? Number(((missedRevisionsCount / totalPastRevisionsCount) * 100).toFixed(2))
            : 0;

    return {
        totalCourses,
        completedCourses,
        totalTopics,
        totalStudyHours,
        totalStudyMinutes,
        learningStreakDays,
        completedRevisionsCount,
        missedRevisionsCount,
        totalPastRevisionsCount,
        revisionCompletionRate,
        missedRevisionRate,
    };
};

const getRangeAnalytics = async (userId, daysCount) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    const endDate = new Date();
    endDate.setHours(0, 0, 0, 0);

    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - (daysCount - 1));

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
    });

    const completedRevisions = await Revision.findAll({
        where: {
            revision_date: {
                [Op.gte]: startDateStr,
                [Op.lte]: endDateStr,
            },
            status: "completed",
        },
        include: [getIncludeHierarchy(userId)],
    });

    const dailyBreakdown = [];
    const currDate = new Date(startDate);

    while (currDate <= endDate) {
        const dateStr = formatDateString(currDate);

        const dayStudyMinutes = studyEntries
            .filter((e) => formatDateString(new Date(e.study_date)) === dateStr)
            .reduce((sum, e) => sum + (e.duration_minutes || 0), 0);

        const dayRevisionsCompleted = completedRevisions.filter(
            (r) => r.revision_date === dateStr
        ).length;

        dailyBreakdown.push({
            date: dateStr,
            studyMinutes: dayStudyMinutes,
            revisionsCompleted: dayRevisionsCompleted,
        });

        currDate.setDate(currDate.getDate() + 1);
    }

    return dailyBreakdown;
};

const getWeekly = async (userId) => {
    return await getRangeAnalytics(userId, 7);
};

const getMonthly = async (userId) => {
    return await getRangeAnalytics(userId, 30);
};

module.exports = {
    getOverview,
    getWeekly,
    getMonthly,
};
