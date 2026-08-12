const request = require("supertest");
const app = require("../../src/app");
const topicService = require("../../src/services/topicService");
const ApiError = require("../../src/utils/ApiError");
const httpStatus = require("../../src/constants/httpStatus");

jest.mock("../../src/services/topicService");

describe("Topic API Integration Tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /api/v1/topics", () => {
        const validPayload = {
            course_id: 1,
            title: "Express Middleware",
            description: "Custom and third-party middlewares",
        };

        it("should return 201 Created on valid payload", async () => {
            const createdTopic = { id: 1, ...validPayload };
            topicService.createTopic.mockResolvedValue(createdTopic);

            const res = await request(app)
                .post("/api/v1/topics")
                .send(validPayload);

            expect(res.status).toBe(201);
            expect(res.body).toEqual({
                success: true,
                message: "Topic created successfully",
                data: createdTopic,
            });
            expect(topicService.createTopic).toHaveBeenCalledWith(validPayload);
        });

        it("should return 400 Bad Request when title is missing", async () => {
            const res = await request(app)
                .post("/api/v1/topics")
                .send({ course_id: 1 });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Validation failed");
            expect(topicService.createTopic).not.toHaveBeenCalled();
        });

        it("should return 404 Not Found when course does not exist", async () => {
            topicService.createTopic.mockRejectedValue(
                new ApiError(httpStatus.NOT_FOUND, "Course not found")
            );

            const res = await request(app)
                .post("/api/v1/topics")
                .send(validPayload);

            expect(res.status).toBe(404);
            expect(res.body).toEqual({
                success: false,
                message: "Course not found",
            });
        });

        it("should return 409 Conflict when duplicate topic exists", async () => {
            topicService.createTopic.mockRejectedValue(
                new ApiError(httpStatus.CONFLICT, "Topic already exists for this course")
            );

            const res = await request(app)
                .post("/api/v1/topics")
                .send(validPayload);

            expect(res.status).toBe(409);
            expect(res.body).toEqual({
                success: false,
                message: "Topic already exists for this course",
            });
        });
    });

    describe("GET /api/v1/topics", () => {
        it("should return 200 OK and list of topics", async () => {
            const mockTopics = [
                { id: 1, title: "Middleware", course_id: 1 },
                { id: 2, title: "Routing", course_id: 1 },
            ];
            topicService.getAllTopics.mockResolvedValue(mockTopics);

            const res = await request(app).get("/api/v1/topics?course_id=1");

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                success: true,
                message: "Topics fetched successfully",
                data: mockTopics,
            });
            expect(topicService.getAllTopics).toHaveBeenCalledWith(1);
        });

        it("should return 400 Bad Request when course_id query param is missing", async () => {
            const res = await request(app).get("/api/v1/topics");

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(topicService.getAllTopics).not.toHaveBeenCalled();
        });
    });

    describe("GET /api/v1/topics/:topicId", () => {
        it("should return 200 OK and topic data", async () => {
            const mockTopic = { id: 1, title: "Routing", course_id: 1 };
            topicService.getTopicById.mockResolvedValue(mockTopic);

            const res = await request(app).get("/api/v1/topics/1");

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                success: true,
                message: "Topic fetched successfully",
                data: mockTopic,
            });
            expect(topicService.getTopicById).toHaveBeenCalledWith(1);
        });

        it("should return 404 Not Found when topic does not exist", async () => {
            topicService.getTopicById.mockRejectedValue(
                new ApiError(httpStatus.NOT_FOUND, "Topic not found")
            );

            const res = await request(app).get("/api/v1/topics/99");

            expect(res.status).toBe(404);
            expect(res.body).toEqual({
                success: false,
                message: "Topic not found",
            });
        });
    });

    describe("PUT /api/v1/topics/:topicId", () => {
        it("should return 200 OK and updated topic", async () => {
            const updatePayload = { title: "Updated Routing Topic" };
            const updatedTopic = { id: 1, title: "Updated Routing Topic", course_id: 1 };
            topicService.updateTopicById.mockResolvedValue(updatedTopic);

            const res = await request(app)
                .put("/api/v1/topics/1")
                .send(updatePayload);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                success: true,
                message: "Topic updated successfully",
                data: updatedTopic,
            });
            expect(topicService.updateTopicById).toHaveBeenCalledWith(1, updatePayload);
        });

        it("should return 400 Bad Request on empty update body", async () => {
            const res = await request(app).put("/api/v1/topics/1").send({});

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(topicService.updateTopicById).not.toHaveBeenCalled();
        });
    });

    describe("DELETE /api/v1/topics/:topicId", () => {
        it("should return 200 OK and deleted topic data", async () => {
            const deletedTopic = { id: 1, title: "Deleted Topic", course_id: 1 };
            topicService.deleteTopicById.mockResolvedValue(deletedTopic);

            const res = await request(app).delete("/api/v1/topics/1");

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                success: true,
                message: "Topic deleted successfully",
                data: deletedTopic,
            });
            expect(topicService.deleteTopicById).toHaveBeenCalledWith(1);
        });

        it("should return 404 Not Found when topic does not exist", async () => {
            topicService.deleteTopicById.mockRejectedValue(
                new ApiError(httpStatus.NOT_FOUND, "Topic not found")
            );

            const res = await request(app).delete("/api/v1/topics/99");

            expect(res.status).toBe(404);
            expect(res.body).toEqual({
                success: false,
                message: "Topic not found",
            });
        });
    });
});
