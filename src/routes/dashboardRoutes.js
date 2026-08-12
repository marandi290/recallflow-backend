const express = require("express");

const router = express.Router();

const validate = require("../middlewares/validate");
const { userIdQuerySchema } = require("../validators/revisionValidator");
const dashboardController = require("../controllers/dashboardController");

router.get(
    "/today",
    validate(userIdQuerySchema, "query"),
    dashboardController.getTodayDashboard
);

module.exports = router;
