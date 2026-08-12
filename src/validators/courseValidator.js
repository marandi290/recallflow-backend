const Joi = require("joi");

const createCourseSchema = Joi.object({
    user_id: Joi.number()
        .integer()
        .positive()
        .required(),

    title: Joi.string()
        .trim()
        .max(100)
        .required(),

    category: Joi.string()
        .trim()
        .max(50)
        .allow(null, ""),

    goal: Joi.string()
        .trim()
        .max(255)
        .allow(null, ""),

    duration_days: Joi.number()
        .integer()
        .positive()
        .required(),

    algorithm: Joi.string()
        .valid(
            "quick",
            "three_month",
            "six_month",
            "one_year",
            "two_year",
            "custom"
        )
        .required(),

    start_date: Joi.date().required(),
});

const updateCourseSchema = Joi.object({
    title: Joi.string()
        .trim()
        .max(100),

    category: Joi.string()
        .trim()
        .max(50)
        .allow(null, ""),

    goal: Joi.string()
        .trim()
        .max(255)
        .allow(null, ""),

    duration_days: Joi.number()
        .integer()
        .positive(),

    algorithm: Joi.string()
        .valid(
            "quick",
            "three_month",
            "six_month",
            "one_year",
            "two_year",
            "custom"
        ),

    start_date: Joi.date(),

    status: Joi.string()
        .valid("active", "completed", "archived"),
})
.min(1); // At least one field must be provided

const courseIdSchema = Joi.object({
    courseId: Joi.number()
        .integer()
        .positive()
        .required(),
});

const userIdSchema = Joi.object({
    user_id: Joi.number()
        .integer()
        .positive()
        .required(),
});

module.exports = {
    createCourseSchema,
    updateCourseSchema,
    courseIdSchema,
    userIdSchema,
};