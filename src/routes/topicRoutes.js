const express = require("express");

const router = express.Router();

const validate = require("../middlewares/validate");
const {
    createTopicSchema,
    updateTopicSchema,
    topicIdSchema,
    courseIdQuerySchema,
} = require("../validators/topicValidator");
const topicController = require("../controllers/topicController");

router.post(
    "/",
    validate(createTopicSchema, "body"),
    topicController.createTopic
);

router.get(
    "/",
    validate(courseIdQuerySchema, "query"),
    topicController.getAllTopics
);

router.get(
    "/:topicId",
    validate(topicIdSchema, "params"),
    topicController.getTopicById
);

router.put(
    "/:topicId",
    validate(topicIdSchema, "params"),
    validate(updateTopicSchema, "body"),
    topicController.updateTopicById
);

router.delete(
    "/:topicId",
    validate(topicIdSchema, "params"),
    topicController.deleteTopicById
);

module.exports = router;
