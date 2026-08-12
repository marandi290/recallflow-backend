const express = require("express");

const router = express.Router();

const validate = require("../middlewares/validate");
const authenticate = require("../middlewares/auth");
const { registerSchema, loginSchema } = require("../validators/authValidator");
const authController = require("../controllers/authController");

router.post(
    "/register",
    validate(registerSchema, "body"),
    authController.register
);

router.post(
    "/login",
    validate(loginSchema, "body"),
    authController.login
);

router.get(
    "/me",
    authenticate,
    authController.getProfile
);

module.exports = router;
