const Joi = require("joi");

const calendarQuerySchema = Joi.object({
    user_id: Joi.number()
        .integer()
        .positive()
        .required(),

    year: Joi.number()
        .integer()
        .min(2000)
        .max(2100)
        .required(),

    month: Joi.number()
        .integer()
        .min(1)
        .max(12)
        .required(),
});

module.exports = {
    calendarQuerySchema,
};
