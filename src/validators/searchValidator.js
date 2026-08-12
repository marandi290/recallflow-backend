const Joi = require("joi");

const searchQuerySchema = Joi.object({
    user_id: Joi.number()
        .integer()
        .positive()
        .required(),

    q: Joi.string()
        .trim()
        .min(1)
        .required(),
});

module.exports = {
    searchQuerySchema,
};
