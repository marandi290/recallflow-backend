const Joi = require("joi");

const createTopicSchema = Joi.object({
    course_id: Joi.number()
        .integer()
        .positive()
        .required(),

    title: Joi.string()
        .trim()
        .max(255)
        .required(),

    description: Joi.string()
        .trim()
        .allow(null, ""),
});

const updateTopicSchema = Joi.object({
    title: Joi.string()
        .trim()
        .max(255),

    description: Joi.string()
        .trim()
        .allow(null, ""),
}).min(1);

const topicIdSchema = Joi.object({
    topicId: Joi.number()
        .integer()
        .positive()
        .required(),
});

const courseIdQuerySchema = Joi.object({
    course_id: Joi.number()
        .integer()
        .positive()
        .required(),
});

module.exports = {
    createTopicSchema,
    updateTopicSchema,
    topicIdSchema,
    courseIdQuerySchema,
};
