const courseService = require("../services/courseService");
const asyncHandler = require("../middlewares/asyncHandler");


const createCourse = asyncHandler(async (req, res) => {
    const course = await courseService.createCourse(req.body);

    return res.status(201).json({
        success: true,
        message: "Course created successfully",
        data: course,
    });
});

const getAllCourses = asyncHandler(async (req, res) => {
    const courses = await courseService.getAllCourses(Number(req.query.user_id));

    if (!courses) {
        throw new ApiError(httpStatus.NOT_FOUND, "Courses not found");
    }

    return res.status(200).json({
        success: true,
        message: "Courses fetched successfully",
        data: courses,
    });
});

const getCourseById = asyncHandler(async (req, res) => {
    const course = await courseService.getCourseById(Number(req.params.courseId));

    if (!course) {
        throw new ApiError(httpStatus.NOT_FOUND, "Course not found");
    }

    return res.status(200).json({
        success: true,
        message: "Course fetched successfully",
        data: course,
    });
});

const updateCourseById = asyncHandler(async (req, res) => {
    const course = await courseService.updateCourseById(Number(req.params.courseId), req.body);

    return res.status(200).json({
        success: true,
        message: "Course updated successfully",
        data: course,
    });
});

const deleteCourseById = asyncHandler(async (req, res) => {
    const course = await courseService.deleteCourseById(Number(req.params.courseId));

    if (!course) {
        throw new ApiError(httpStatus.NOT_FOUND, "Course not found");
    }

    return res.status(200).json({
        success: true,
        message: "Course deleted successfully",
        data: course,
    });
});

module.exports = {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourseById,
    deleteCourseById,
};