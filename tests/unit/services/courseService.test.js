jest.mock("../../../src/models", () => ({
    User: {
        findByPk: jest.fn(),
    },
    Course: {
        findByPk: jest.fn(),
        findOne: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
    },
}));


const { User, Course } = require("../../../src/models");
const courseService = require("../../../src/services/courseService");
const ApiError = require("../../../src/utils/ApiError");

/**
 * unit test for course service
 * mock:
 * 1. User.findByPk()
 * 2. Course.findByPk()
 * 3. Course.findOne()
 * 4. Course.findAll()
 * 5. Course.create()
 */

describe("CourseService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("createCourse", () => {
        it("Should create a course successfully", async () => {
            const input = {
                user_id: 1,
                title: "Course 1",
                algorithm: "three_month"
            };

            const createdCourse = {
                id: 1,
                ...input
            };

            User.findByPk.mockResolvedValue({ id: input.user_id, name: "Prakash" });
            Course.findOne.mockResolvedValue(null);
            Course.create.mockResolvedValue(createdCourse);

            const result = await courseService.createCourse(input);

            expect(User.findByPk).toHaveBeenCalledWith(input.user_id);
            expect(Course.findOne).toHaveBeenCalledWith({ where: { user_id: input.user_id, title: input.title } });
            expect(Course.create).toHaveBeenCalledWith(input);
            expect(result).toEqual(createdCourse);
        });

        it("should throw 404 if user does not exist", async () => {
            const input = {
                user_id: 99,
                title: "Course 1",
                algorithm: "three_month"
            };

            User.findByPk.mockResolvedValue(null);

            await expect(courseService.createCourse(input)).rejects.toThrow(ApiError);
            expect(User.findByPk).toHaveBeenCalledWith(99);
            expect(Course.create).not.toHaveBeenCalled();
        });

        it("should throw 409 if course already exists", async () => {
            const input = {
                user_id: 1,
                title: "Course 1",
                algorithm: "three_month"
            };

            User.findByPk.mockResolvedValue({ id: input.user_id, name: "Prakash" });
            Course.findOne.mockResolvedValue({ id: 1, ...input });

            await expect(courseService.createCourse(input)).rejects.toThrow("Course already exists");
            expect(Course.create).not.toHaveBeenCalled();
        });

        it("should throw an error if Course.create() fails", async () => {
            const input = {
                user_id: 1,
                title: "Course 1",
                algorithm: "three_month",
            };

            User.findByPk.mockResolvedValue({ id: input.user_id });
            Course.findOne.mockResolvedValue(null);
            Course.create.mockRejectedValue(new Error("Database error"));

            await expect(courseService.createCourse(input)).rejects.toThrow("Database error");
            expect(Course.create).toHaveBeenCalledWith(input);
        });
    });

    describe("getAllCourses", () => {
        it("should return all courses for a user", async () => {
            const userId = 1;

            const courses = [
                { id: 1, title: "Node.js" },
                { id: 2, title: "System Design" },
            ];

            User.findByPk.mockResolvedValue({ id: userId, name: "Prakash" });
            Course.findAll.mockResolvedValue(courses);

            const result = await courseService.getAllCourses(userId);

            expect(User.findByPk).toHaveBeenCalledWith(userId);
            expect(Course.findAll).toHaveBeenCalledWith({
                where: { user_id: userId },
                order: [["created_at", "DESC"]],
            });
            expect(result).toEqual(courses);
        });

        it("should throw 404 if user does not exist", async () => {
            const userId = 99;

            User.findByPk.mockResolvedValue(null);

            await expect(courseService.getAllCourses(userId)).rejects.toThrow("User not found");
            expect(User.findByPk).toHaveBeenCalledWith(userId);
            expect(Course.findAll).not.toHaveBeenCalled();
        });

        it("should throw an error if Course.findAll() fails", async () => {
            const userId = 1;

            User.findByPk.mockResolvedValue({ id: userId, name: "Prakash" });
            Course.findAll.mockRejectedValue(new Error("Database error"));

            await expect(courseService.getAllCourses(userId)).rejects.toThrow("Database error");
            expect(Course.findAll).toHaveBeenCalledWith({
                where: { user_id: userId },
                order: [["created_at", "DESC"]],
            });
        });
    });

    describe("getCourseById", () => {
        it("should return a course for a course_id", async () => {
            const courseId = 1;
            const course = {
                id: courseId,
                title: "Course 1",
                user_id: 1,
            };

            Course.findByPk.mockResolvedValue(course);

            const result = await courseService.getCourseById(courseId);

            expect(Course.findByPk).toHaveBeenCalledWith(courseId);
            expect(result).toEqual(course);
        });

        it("should throw 404 if course_id does not exist", async () => {
            const courseId = 99;

            Course.findByPk.mockResolvedValue(null);

            await expect(courseService.getCourseById(courseId)).rejects.toThrow("Course not found");
            expect(Course.findByPk).toHaveBeenCalledWith(courseId);
        });

        it("should throw an error if Course.findByPk() fails", async () => {
            const courseId = 1;

            Course.findByPk.mockRejectedValue(new Error("Database error"));

            await expect(courseService.getCourseById(courseId)).rejects.toThrow("Database error");
            expect(Course.findByPk).toHaveBeenCalledWith(courseId);
        });
    });

    describe("updateCourseById", () => {
        it("should update a course successfully", async () => {
            const courseId = 1;
            const updateData = { title: "Updated Title" };
            const mockSave = jest.fn().mockResolvedValue({ id: courseId, title: "Updated Title" });
            const mockCourse = { id: courseId, title: "Old Title", save: mockSave };

            Course.findByPk.mockResolvedValue(mockCourse);

            const result = await courseService.updateCourseById(courseId, updateData);

            expect(Course.findByPk).toHaveBeenCalledWith(courseId);
            expect(mockSave).toHaveBeenCalled();
            expect(result).toEqual({ id: courseId, title: "Updated Title" });
        });

        it("should throw 404 if course to update does not exist", async () => {
            const courseId = 99;
            const updateData = { title: "Updated Title" };

            Course.findByPk.mockResolvedValue(null);

            await expect(courseService.updateCourseById(courseId, updateData)).rejects.toThrow("Course not found");
            expect(Course.findByPk).toHaveBeenCalledWith(courseId);
        });

        it("should throw an error if course.save() fails", async () => {
            const courseId = 1;
            const updateData = { title: "Updated Title" };
            const mockSave = jest.fn().mockRejectedValue(new Error("Database error"));
            const mockCourse = { id: courseId, title: "Old Title", save: mockSave };

            Course.findByPk.mockResolvedValue(mockCourse);

            await expect(courseService.updateCourseById(courseId, updateData)).rejects.toThrow("Database error");
            expect(Course.findByPk).toHaveBeenCalledWith(courseId);
            expect(mockSave).toHaveBeenCalled();
        });
    });

    describe("deleteCourseById", () => {
        it("should delete a course successfully", async () => {
            const courseId = 1;
            const mockDestroy = jest.fn().mockResolvedValue(true);
            const mockCourse = { id: courseId, title: "Course to delete", destroy: mockDestroy };

            Course.findByPk.mockResolvedValue(mockCourse);

            const result = await courseService.deleteCourseById(courseId);

            expect(Course.findByPk).toHaveBeenCalledWith(courseId);
            expect(mockDestroy).toHaveBeenCalled();
            expect(result).toEqual(mockCourse);
        });

        it("should throw 404 if course to delete does not exist", async () => {
            const courseId = 99;

            Course.findByPk.mockResolvedValue(null);

            await expect(courseService.deleteCourseById(courseId)).rejects.toThrow("Course not found");
            expect(Course.findByPk).toHaveBeenCalledWith(courseId);
        });

        it("should throw an error if course.destroy() fails", async () => {
            const courseId = 1;
            const mockDestroy = jest.fn().mockRejectedValue(new Error("Database error"));
            const mockCourse = { id: courseId, title: "Course to delete", destroy: mockDestroy };

            Course.findByPk.mockResolvedValue(mockCourse);

            await expect(courseService.deleteCourseById(courseId)).rejects.toThrow("Database error");
            expect(Course.findByPk).toHaveBeenCalledWith(courseId);
            expect(mockDestroy).toHaveBeenCalled();
        });
    });
});

