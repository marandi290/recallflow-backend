const express = require("express");

const router = express.Router();

const validate = require("../middlewares/validate");
const { userIdQuerySchema } = require("../validators/notificationValidator");
const notificationController = require("../controllers/notificationController");

router.get(
    "/",
    validate(userIdQuerySchema, "query"),
    notificationController.getUserNotifications
);

module.exports = router;
