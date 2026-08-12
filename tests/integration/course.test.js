const request = require("supertest");
const app = require("../../src/app");
const courseService = require("../../src/services/courseService");
const ApiError = require("../../src/utils/ApiError");
const httpStatus = require("../../src/constants/httpStatus");

jest.mock("../../src/services/courseService");

describe("Course API Integration Tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /api/v1/courses", () => {
        const validCoursePayload = {
            user_id: 1,
            title: "Data Structures & Algorithms",
            category: "Computer Science",
            goal: "Master DSA for interviews",
            duration_days: 90,
            algorithm: "three_month",
            start_date: "2026-08-11",
        };

        it("should return 201 Created and course data on valid payload", async () => {
            const createdCourse = { id: 1, ...validCoursePayload };
            courseService.createCourse.mockResolvedValue(createdCourse);

            const res = await request(app)
                .post("/api/v1/courses")
                .send(validCoursePayload);

            expect(res.status).toBe(201);
            expect(res.body).toEqual({
                success: true,
                message: "Course created successfully",
                data: createdCourse,
            });
            expect(courseService.createCourse).toHaveBeenCalledWith({
                ...validCoursePayload,
                start_date: new Date(validCoursePayload.start_date),
            });
        });

        it("should return 400 Bad Request when required validation fails", async () => {
            const res = await request(app)
                .post("/api/v1/courses")
                .send({ title: "Incomplete Course" });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Validation failed");
            expect(res.body.errors).toBeDefined();
            expect(courseService.createCourse).not.toHaveBeenCalled();
        });

        it("should return 404 Not Found when user does not exist", async () => {
            courseService.createCourse.mockRejectedValue(
                new ApiError(httpStatus.NOT_FOUND, "User not found")
            );

            const res = await request(app)
                .post("/api/v1/courses")
                .send(validCoursePayload);

            expect(res.status).toBe(404);
            expect(res.body).toEqual({
                success: false,
                message: "User not found",
            });
        });

        it("should return 409 Conflict when duplicate course exists", async () => {
            courseService.createCourse.mockRejectedValue(
                new ApiError(httpStatus.CONFLICT, "Course already exists")
            );

            const res = await request(app)
                .post("/api/v1/courses")
                .send(validCoursePayload);

            expect(res.status).toBe(409);
            expect(res.body).toEqual({
                success: false,
                message: "Course already exists",
            });
        });
    });

    describe("GET /api/v1/courses", () => {
        it("should return 200 OK and array of courses", async () => {
            const mockCourses = [
                { id: 1, title: "Node.js", user_id: 1 },
                { id: 2, title: "System Design", user_id: 1 },
            ];
            courseService.getAllCourses.mockResolvedValue(mockCourses);

            const res = await request(app).get("/api/v1/courses?user_id=1");

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                success: true,
                message: "Courses fetched successfully",
                data: mockCourses,
            });
            expect(courseService.getAllCourses).toHaveBeenCalledWith(1);
        });

        it("should return 400 Bad Request when user_id query param is missing", async () => {
            const res = await request(app).get("/api/v1/courses");

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(courseService.getAllCourses).not.toHaveBeenCalled();
        });

        it("should return 404 Not Found when user is not found", async () => {
            courseService.getAllCourses.mockRejectedValue(
                new ApiError(httpStatus.NOT_FOUND, "User not found")
            );

            const res = await request(app).get("/api/v1/courses?user_id=99");

            expect(res.status).toBe(404);
            expect(res.body).toEqual({
                success: false,
                message: "User not found",
            });
        });
    });

    describe("GET /api/v1/courses/:courseId", () => {
        it("should return 200 OK and course data when course exists", async () => {
            const mockCourse = { id: 1, title: "Node.js", user_id: 1 };
            courseService.getCourseById.mockResolvedValue(mockCourse);

            const res = await request(app).get("/api/v1/courses/1");

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                success: true,
                message: "Course fetched successfully",
                data: mockCourse,
            });
            expect(courseService.getCourseById).toHaveBeenCalledWith(1);
        });

        it("should return 400 Bad Request when courseId is not a positive integer", async () => {
            const res = await request(app).get("/api/v1/courses/abc");

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(courseService.getCourseById).not.toHaveBeenCalled();
        });

        it("should return 404 Not Found when course does not exist", async () => {
            courseService.getCourseById.mockRejectedValue(
                new ApiError(httpStatus.NOT_FOUND, "Course not found")
            );

            const res = await request(app).get("/api/v1/courses/99");

            expect(res.status).toBe(404);
            expect(res.body).toEqual({
                success: false,
                message: "Course not found",
            });
        });
    });

    describe("PUT /api/v1/courses/:courseId", () => {
        it("should return 200 OK and updated course when payload is valid", async () => {
            const updatePayload = { title: "Updated Title" };
            const updatedCourse = { id: 1, title: "Updated Title", user_id: 1 };
            courseService.updateCourseById.mockResolvedValue(updatedCourse);

            const res = await request(app)
                .put("/api/v1/courses/1")
                .send(updatePayload);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                success: true,
                message: "Course updated successfully",
                data: updatedCourse,
            });
            expect(courseService.updateCourseById).toHaveBeenCalledWith(1, updatePayload);
        });

        it("should return 400 Bad Request when request body is empty", async () => {
            const res = await request(app).put("/api/v1/courses/1").send({});

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(courseService.updateCourseById).not.toHaveBeenCalled();
        });

        it("should return 404 Not Found when course to update does not exist", async () => {
            courseService.updateCourseById.mockRejectedValue(
                new ApiError(httpStatus.NOT_FOUND, "Course not found")
            );

            const res = await request(app)
                .put("/api/v1/courses/99")
                .send({ title: "Updated Title" });

            expect(res.status).toBe(404);
            expect(res.body).toEqual({
                success: false,
                message: "Course not found",
            });
        });
    });

    describe("DELETE /api/v1/courses/:courseId", () => {
        it("should return 200 OK and deleted course data", async () => {
            const deletedCourse = { id: 1, title: "Deleted Course", user_id: 1 };
            courseService.deleteCourseById.mockResolvedValue(deletedCourse);

            const res = await request(app).delete("/api/v1/courses/1");

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                success: true,
                message: "Course deleted successfully",
                data: deletedCourse,
            });
            expect(courseService.deleteCourseById).toHaveBeenCalledWith(1);
        });

        it("should return 404 Not Found when course to delete does not exist", async () => {
            courseService.deleteCourseById.mockRejectedValue(
                new ApiError(httpStatus.NOT_FOUND, "Course not found")
            );

            const res = await request(app).delete("/api/v1/courses/99");

            expect(res.status).toBe(404);
            expect(res.body).toEqual({
                success: false,
                message: "Course not found",
            });
        });
    });
});
