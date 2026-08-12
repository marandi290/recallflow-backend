const topicService = require("../services/topicService");
const asyncHandler = require("../middlewares/asyncHandler");

const createTopic = asyncHandler(async (req, res) => {
    const topic = await topicService.createTopic(req.body);

    return res.status(201).json({
        success: true,
        message: "Topic created successfully",
        data: topic,
    });
});

const getAllTopics = asyncHandler(async (req, res) => {
    const topics = await topicService.getAllTopics(Number(req.query.course_id));

    return res.status(200).json({
        success: true,
        message: "Topics fetched successfully",
        data: topics,
    });
});

const getTopicById = asyncHandler(async (req, res) => {
    const topic = await topicService.getTopicById(Number(req.params.topicId));

    return res.status(200).json({
        success: true,
        message: "Topic fetched successfully",
        data: topic,
    });
});

const updateTopicById = asyncHandler(async (req, res) => {
    const topic = await topicService.updateTopicById(Number(req.params.topicId), req.body);

    return res.status(200).json({
        success: true,
        message: "Topic updated successfully",
        data: topic,
    });
});

const deleteTopicById = asyncHandler(async (req, res) => {
    const topic = await topicService.deleteTopicById(Number(req.params.topicId));

    return res.status(200).json({
        success: true,
        message: "Topic deleted successfully",
        data: topic,
    });
});

module.exports = {
    createTopic,
    getAllTopics,
    getTopicById,
    updateTopicById,
    deleteTopicById,
};
