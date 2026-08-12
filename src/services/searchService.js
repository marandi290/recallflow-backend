const { Op } = require("sequelize");
const { User, Course, Topic, StudyEntry, Revision } = require("../models");
const ApiError = require("../utils/ApiError");
const httpStatus = require("../constants/httpStatus");

const searchAll = async (userId, query) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    const searchPattern = `%${query}%`;

    const courses = await Course.findAll({
        where: {
            user_id: userId,
            [Op.or]: [
                { title: { [Op.like]: searchPattern } },
                { category: { [Op.like]: searchPattern } },
                { goal: { [Op.like]: searchPattern } },
            ],
        },
    });

    const topics = await Topic.findAll({
        where: {
            [Op.or]: [
                { title: { [Op.like]: searchPattern } },
                { description: { [Op.like]: searchPattern } },
            ],
        },
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
        where: {
            study_notes: { [Op.like]: searchPattern },
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

    const revisions = await Revision.findAll({
        where: {
            revision_notes: { [Op.like]: searchPattern },
        },
        include: [
            {
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
            },
        ],
    });

    const totalResults =
        courses.length + topics.length + studyEntries.length + revisions.length;

    return {
        query,
        totalResults,
        courses,
        topics,
        studyEntries,
        revisions,
    };
};

module.exports = {
    searchAll,
};
