const { User, Course } = require("../models");
const ApiError = require("../utils/ApiError");
const httpStatus = require("../constants/httpStatus");

const createCourse = async (courseData) => {
    const user = await User.findByPk(courseData.user_id);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    const existingCourse = await Course.findOne({
        where: {
            title: courseData.title,
            user_id: courseData.user_id
        }
    });
    if (existingCourse) {
        throw new ApiError(httpStatus.CONFLICT, "Course already exists");
    }

    return await Course.create(courseData);
};

const getAllCourses = async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    return await Course.findAll({
        where: {
            user_id: userId
        },
        order: [["created_at", "DESC"]]
    });
};

const getCourseById = async (courseId) => {
    const course = await Course.findByPk(courseId);
    if (!course) {
        throw new ApiError(httpStatus.NOT_FOUND, "Course not found");
    }
    return course;
};

const updateCourseById = async (courseId, updateData) => {
    const course = await Course.findByPk(courseId);

    if (!course) {
        throw new ApiError(httpStatus.NOT_FOUND, "Course not found");
    }

    Object.assign(course, updateData);

    return await course.save();
}

const deleteCourseById = async (courseId) => {
    const course = await Course.findByPk(courseId);
    if (!course) {
        throw new ApiError(httpStatus.NOT_FOUND, "Course not found");
    }
    await course.destroy();
    return course;
}

module.exports = {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourseById,
    deleteCourseById
};