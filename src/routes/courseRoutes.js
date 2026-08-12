const express = require("express");

const router = express.Router();

const validate = require("../middlewares/validate");
const { createCourseSchema, updateCourseSchema, courseIdSchema, userIdSchema } = require("../validators/courseValidator");
const courseController = require("../controllers/courseController");

router.post(
    "/",
    validate(createCourseSchema, "body"),
    courseController.createCourse
);

router.get("/", validate(userIdSchema, "query"), courseController.getAllCourses);

router.get("/:courseId", validate(courseIdSchema, "params"), courseController.getCourseById);

router.put(
    "/:courseId",
    validate(courseIdSchema, "params"),
    validate(updateCourseSchema, "body"),
    courseController.updateCourseById
);

router.delete("/:courseId", validate(courseIdSchema, "params"), courseController.deleteCourseById);

module.exports = router;