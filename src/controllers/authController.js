const authService = require("../services/authService");
const asyncHandler = require("../middlewares/asyncHandler");

const register = asyncHandler(async (req, res) => {
    const data = await authService.register(req.body);

    return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data,
    });
});

const login = asyncHandler(async (req, res) => {
    const data = await authService.login(req.body);

    return res.status(200).json({
        success: true,
        message: "Login successful",
        data,
    });
});

const getProfile = asyncHandler(async (req, res) => {
    const user = await authService.getProfile(req.user.id);

    return res.status(200).json({
        success: true,
        message: "User profile fetched successfully",
        data: user,
    });
});

module.exports = {
    register,
    login,
    getProfile,
};
