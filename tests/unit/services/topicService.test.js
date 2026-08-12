jest.mock("../../../src/models", () => ({
    Course: {
        findByPk: jest.fn(),
    },
    Topic: {
        findByPk: jest.fn(),
        findOne: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
    },
}));

const { Course, Topic } = require("../../../src/models");
const topicService = require("../../../src/services/topicService");
const ApiError = require("../../../src/utils/ApiError");

describe("TopicService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("createTopic", () => {
        it("should create a topic successfully", async () => {
            const input = {
                course_id: 1,
                title: "Promises & Async/Await",
                description: "Deep dive into JS async patterns",
            };

            const createdTopic = { id: 1, ...input };

            Course.findByPk.mockResolvedValue({ id: 1, title: "Node.js" });
            Topic.findOne.mockResolvedValue(null);
            Topic.create.mockResolvedValue(createdTopic);

            const result = await topicService.createTopic(input);

            expect(Course.findByPk).toHaveBeenCalledWith(1);
            expect(Topic.findOne).toHaveBeenCalledWith({
                where: { course_id: 1, title: input.title },
            });
            expect(Topic.create).toHaveBeenCalledWith(input);
            expect(result).toEqual(createdTopic);
        });

        it("should throw 404 if course does not exist", async () => {
            const input = { course_id: 99, title: "Topic 1" };

            Course.findByPk.mockResolvedValue(null);

            await expect(topicService.createTopic(input)).rejects.toThrow("Course not found");
            expect(Course.findByPk).toHaveBeenCalledWith(99);
            expect(Topic.create).not.toHaveBeenCalled();
        });

        it("should throw 409 if topic already exists for course", async () => {
            const input = { course_id: 1, title: "Topic 1" };

            Course.findByPk.mockResolvedValue({ id: 1 });
            Topic.findOne.mockResolvedValue({ id: 1, ...input });

            await expect(topicService.createTopic(input)).rejects.toThrow(
                "Topic already exists for this course"
            );
            expect(Topic.create).not.toHaveBeenCalled();
        });

        it("should throw an error if Topic.create() fails", async () => {
            const input = { course_id: 1, title: "Topic 1" };

            Course.findByPk.mockResolvedValue({ id: 1 });
            Topic.findOne.mockResolvedValue(null);
            Topic.create.mockRejectedValue(new Error("Database error"));

            await expect(topicService.createTopic(input)).rejects.toThrow("Database error");
        });
    });

    describe("getAllTopics", () => {
        it("should return all topics for a course", async () => {
            const courseId = 1;
            const topics = [
                { id: 1, title: "Topic A", course_id: 1 },
                { id: 2, title: "Topic B", course_id: 1 },
            ];

            Course.findByPk.mockResolvedValue({ id: 1 });
            Topic.findAll.mockResolvedValue(topics);

            const result = await topicService.getAllTopics(courseId);

            expect(Course.findByPk).toHaveBeenCalledWith(1);
            expect(Topic.findAll).toHaveBeenCalledWith({
                where: { course_id: 1 },
                order: [["created_at", "DESC"]],
            });
            expect(result).toEqual(topics);
        });

        it("should throw 404 if course does not exist", async () => {
            Course.findByPk.mockResolvedValue(null);

            await expect(topicService.getAllTopics(99)).rejects.toThrow("Course not found");
            expect(Topic.findAll).not.toHaveBeenCalled();
        });

        it("should throw error if Topic.findAll() fails", async () => {
            Course.findByPk.mockResolvedValue({ id: 1 });
            Topic.findAll.mockRejectedValue(new Error("Database error"));

            await expect(topicService.getAllTopics(1)).rejects.toThrow("Database error");
        });
    });

    describe("getTopicById", () => {
        it("should return topic by ID", async () => {
            const topic = { id: 1, title: "Topic A", course_id: 1 };
            Topic.findByPk.mockResolvedValue(topic);

            const result = await topicService.getTopicById(1);

            expect(Topic.findByPk).toHaveBeenCalledWith(1);
            expect(result).toEqual(topic);
        });

        it("should throw 404 if topic not found", async () => {
            Topic.findByPk.mockResolvedValue(null);

            await expect(topicService.getTopicById(99)).rejects.toThrow("Topic not found");
        });

        it("should throw error if Topic.findByPk() fails", async () => {
            Topic.findByPk.mockRejectedValue(new Error("Database error"));

            await expect(topicService.getTopicById(1)).rejects.toThrow("Database error");
        });
    });

    describe("updateTopicById", () => {
        it("should update a topic successfully", async () => {
            const topicId = 1;
            const updateData = { title: "Updated Topic Title" };
            const mockSave = jest.fn().mockResolvedValue({ id: 1, title: "Updated Topic Title", course_id: 1 });
            const mockTopic = { id: 1, title: "Old Title", course_id: 1, save: mockSave };

            Topic.findByPk.mockResolvedValue(mockTopic);
            Topic.findOne.mockResolvedValue(null);

            const result = await topicService.updateTopicById(topicId, updateData);

            expect(Topic.findByPk).toHaveBeenCalledWith(1);
            expect(mockSave).toHaveBeenCalled();
            expect(result).toEqual({ id: 1, title: "Updated Topic Title", course_id: 1 });
        });

        it("should throw 404 if topic to update does not exist", async () => {
            Topic.findByPk.mockResolvedValue(null);

            await expect(topicService.updateTopicById(99, { title: "New" })).rejects.toThrow("Topic not found");
        });

        it("should throw 409 if new title collides with existing topic in same course", async () => {
            const mockTopic = { id: 1, title: "Old Title", course_id: 1 };
            Topic.findByPk.mockResolvedValue(mockTopic);
            Topic.findOne.mockResolvedValue({ id: 2, title: "New Title", course_id: 1 });

            await expect(topicService.updateTopicById(1, { title: "New Title" })).rejects.toThrow(
                "Topic with this title already exists in course"
            );
        });
    });

    describe("deleteTopicById", () => {
        it("should delete topic successfully", async () => {
            const mockDestroy = jest.fn().mockResolvedValue(true);
            const mockTopic = { id: 1, title: "Topic to delete", destroy: mockDestroy };

            Topic.findByPk.mockResolvedValue(mockTopic);

            const result = await topicService.deleteTopicById(1);

            expect(Topic.findByPk).toHaveBeenCalledWith(1);
            expect(mockDestroy).toHaveBeenCalled();
            expect(result).toEqual(mockTopic);
        });

        it("should throw 404 if topic to delete does not exist", async () => {
            Topic.findByPk.mockResolvedValue(null);

            await expect(topicService.deleteTopicById(99)).rejects.toThrow("Topic not found");
        });
    });
});
