const Joi = require("joi");

const generateAISchema = Joi.object({
    topic_title: Joi.string()
        .trim()
        .max(255)
        .required(),

    study_notes: Joi.string()
        .trim()
        .allow(null, ""),
});

module.exports = {
    generateAISchema,
};
