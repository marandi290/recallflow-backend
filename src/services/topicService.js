const { Course, Topic } = require("../models");
const ApiError = require("../utils/ApiError");
const httpStatus = require("../constants/httpStatus");

const createTopic = async (topicData) => {
    const course = await Course.findByPk(topicData.course_id);
    if (!course) {
        throw new ApiError(httpStatus.NOT_FOUND, "Course not found");
    }

    const existingTopic = await Topic.findOne({
        where: {
            course_id: topicData.course_id,
            title: topicData.title,
        },
    });

    if (existingTopic) {
        throw new ApiError(httpStatus.CONFLICT, "Topic already exists for this course");
    }

    return await Topic.create(topicData);
};

const getAllTopics = async (courseId) => {
    const course = await Course.findByPk(courseId);
    if (!course) {
        throw new ApiError(httpStatus.NOT_FOUND, "Course not found");
    }

    return await Topic.findAll({
        where: {
            course_id: courseId,
        },
        order: [["created_at", "DESC"]],
    });
};

const getTopicById = async (topicId) => {
    const topic = await Topic.findByPk(topicId);
    if (!topic) {
        throw new ApiError(httpStatus.NOT_FOUND, "Topic not found");
    }

    return topic;
};

const updateTopicById = async (topicId, updateData) => {
    const topic = await Topic.findByPk(topicId);
    if (!topic) {
        throw new ApiError(httpStatus.NOT_FOUND, "Topic not found");
    }

    if (updateData.title && updateData.title !== topic.title) {
        const existingTopic = await Topic.findOne({
            where: {
                course_id: topic.course_id,
                title: updateData.title,
            },
        });

        if (existingTopic) {
            throw new ApiError(httpStatus.CONFLICT, "Topic with this title already exists in course");
        }
    }

    Object.assign(topic, updateData);
    return await topic.save();
};

const deleteTopicById = async (topicId) => {
    const topic = await Topic.findByPk(topicId);
    if (!topic) {
        throw new ApiError(httpStatus.NOT_FOUND, "Topic not found");
    }

    await topic.destroy();
    return topic;
};

module.exports = {
    createTopic,
    getAllTopics,
    getTopicById,
    updateTopicById,
    deleteTopicById,
};
