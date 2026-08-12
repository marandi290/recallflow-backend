const express = require("express");

const router = express.Router();

const validate = require("../middlewares/validate");
const { userIdQuerySchema } = require("../validators/analyticsValidator");
const analyticsController = require("../controllers/analyticsController");

router.get(
    "/overview",
    validate(userIdQuerySchema, "query"),
    analyticsController.getOverview
);

router.get(
    "/weekly",
    validate(userIdQuerySchema, "query"),
    analyticsController.getWeekly
);

router.get(
    "/monthly",
    validate(userIdQuerySchema, "query"),
    analyticsController.getMonthly
);

module.exports = router;
