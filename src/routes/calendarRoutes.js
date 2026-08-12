const express = require("express");

const router = express.Router();

const validate = require("../middlewares/validate");
const { calendarQuerySchema } = require("../validators/calendarValidator");
const calendarController = require("../controllers/calendarController");

router.get(
    "/",
    validate(calendarQuerySchema, "query"),
    calendarController.getMonthCalendar
);

module.exports = router;
