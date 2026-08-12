const Joi = require("joi");

const revisionIdSchema = Joi.object({
    revisionId: Joi.number()
        .integer()
        .positive()
        .required(),
});

const userIdQuerySchema = Joi.object({
    user_id: Joi.number()
        .integer()
        .positive()
        .required(),
});

const completeRevisionSchema = Joi.object({
    revision_notes: Joi.string()
        .trim()
        .allow(null, ""),
});

module.exports = {
    revisionIdSchema,
    userIdQuerySchema,
    completeRevisionSchema,
};
