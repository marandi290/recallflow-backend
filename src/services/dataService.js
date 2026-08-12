const { User, Course, Topic, StudyEntry, Revision } = require("../models");
const ApiError = require("../utils/ApiError");
const httpStatus = require("../constants/httpStatus");

const exportUserData = async (userId) => {
    const user = await User.findByPk(userId, {
        attributes: { exclude: ["password"] },
    });

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    const courses = await Course.findAll({
        where: { user_id: userId },
        include: [
            {
                model: Topic,
                as: "topics",
                include: [
                    {
                        model: StudyEntry,
                        as: "studyEntries",
                        include: [
                            {
                                model: Revision,
                                as: "revisions",
                            },
                        ],
                    },
                ],
            },
        ],
    });

    return {
        exportDate: new Date().toISOString(),
        version: "1.0.0",
        user,
        courses,
    };
};

const importUserData = async (userId, payload) => {
    if (!payload || !payload.courses || !Array.isArray(payload.courses)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid backup file payload. Must contain courses array.");
    }

    let importedCoursesCount = 0;
    let importedTopicsCount = 0;

    for (const c of payload.courses) {
        const [course] = await Course.findOrCreate({
            where: { user_id: userId, title: c.title },
            defaults: {
                category: c.category || "Imported",
                goal: c.goal || "",
                duration_days: c.duration_days || 90,
                algorithm: c.algorithm || "three_month",
                start_date: c.start_date || new Date().toISOString().split("T")[0],
                status: c.status || "active",
            },
        });
        importedCoursesCount++;

        if (c.topics && Array.isArray(c.topics)) {
            for (const t of c.topics) {
                const [topic] = await Topic.findOrCreate({
                    where: { course_id: course.id, title: t.title },
                    defaults: {
                        description: t.description || "",
                    },
                });
                importedTopicsCount++;
            }
        }
    }

    return {
        success: true,
        message: "Data imported successfully",
        importedCoursesCount,
        importedTopicsCount,
    };
};

module.exports = {
    exportUserData,
    importUserData,
};
