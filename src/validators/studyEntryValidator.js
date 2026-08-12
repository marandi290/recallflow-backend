const Joi = require("joi");

const createStudyEntrySchema = Joi.object({
    topic_id: Joi.number()
        .integer()
        .positive()
        .required(),

    study_date: Joi.date().required(),

    duration_minutes: Joi.number()
        .integer()
        .positive()
        .required(),

    difficulty: Joi.string()
        .valid("easy", "medium", "hard")
        .required(),

    study_notes: Joi.string()
        .trim()
        .allow(null, ""),
});

const updateStudyEntrySchema = Joi.object({
    study_date: Joi.date(),

    duration_minutes: Joi.number()
        .integer()
        .positive(),

    difficulty: Joi.string()
        .valid("easy", "medium", "hard"),

    study_notes: Joi.string()
        .trim()
        .allow(null, ""),
}).min(1);

const studyEntryIdSchema = Joi.object({
    studyEntryId: Joi.number()
        .integer()
        .positive()
        .required(),
});

const topicIdQuerySchema = Joi.object({
    topic_id: Joi.number()
        .integer()
        .positive()
        .required(),
});

module.exports = {
    createStudyEntrySchema,
    updateStudyEntrySchema,
    studyEntryIdSchema,
    topicIdQuerySchema,
};
