const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const ApiError = require("../utils/ApiError");
const httpStatus = require("../constants/httpStatus");

const JWT_SECRET = process.env.JWT_SECRET || "recallflow_secret_key_2026";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

const register = async (userData) => {
    const existingUser = await User.findOne({ where: { email: userData.email } });
    if (existingUser) {
        throw new ApiError(httpStatus.CONFLICT, "Email is already registered");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const newUser = await User.create({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        subscription_status: "trial",
        trial_ends_at: trialEndsAt,
    });

    const token = generateToken(newUser);

    const userObj = newUser.toJSON();
    delete userObj.password;

    return {
        user: userObj,
        token,
    };
};

const login = async ({ email, password }) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid email or password");
    }

    if (!user.password) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid email or password");
    }

    const token = generateToken(user);

    const userObj = user.toJSON();
    delete userObj.password;

    return {
        user: userObj,
        token,
    };
};

const getProfile = async (userId) => {
    const user = await User.findByPk(userId, {
        attributes: { exclude: ["password"] },
    });

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    return user;
};

module.exports = {
    register,
    login,
    getProfile,
    generateToken,
};
