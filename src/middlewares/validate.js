module.exports = (schema, property = "body") => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[property], {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: error.details.map((detail) => detail.message),
            });
        }

        if (property === "query" || property === "params") {
            Object.keys(req[property]).forEach((key) => delete req[property][key]);
            Object.assign(req[property], value);
        } else {
            req[property] = value;
        }

        next();
    };
};