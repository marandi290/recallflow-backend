const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const httpStatus = require("../constants/httpStatus");

const JWT_SECRET = process.env.JWT_SECRET || "recallflow_secret_key_2026";

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Authorization token missing or invalid");
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid or expired authorization token");
    }
};

module.exports = authenticate;
