const Joi = require("joi");

const userIdQuerySchema = Joi.object({
    user_id: Joi.number()
        .integer()
        .positive()
        .required(),
});

module.exports = {
    userIdQuerySchema,
};
