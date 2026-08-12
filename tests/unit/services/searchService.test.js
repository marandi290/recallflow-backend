jest.mock("../../../src/models", () => ({
    User: {
        findByPk: jest.fn(),
    },
    Course: {
        findAll: jest.fn(),
    },
    Topic: {
        findAll: jest.fn(),
    },
    StudyEntry: {
        findAll: jest.fn(),
    },
    Revision: {
        findAll: jest.fn(),
    },
}));

const { User, Course, Topic, StudyEntry, Revision } = require("../../../src/models");
const searchService = require("../../../src/services/searchService");

describe("SearchService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("searchAll", () => {
        it("should return matching results across all entities", async () => {
            User.findByPk.mockResolvedValue({ id: 1 });
            Course.findAll.mockResolvedValue([{ id: 1, title: "Node.js" }]);
            Topic.findAll.mockResolvedValue([{ id: 1, title: "Node.js Basics" }]);
            StudyEntry.findAll.mockResolvedValue([]);
            Revision.findAll.mockResolvedValue([]);

            const result = await searchService.searchAll(1, "node");

            expect(User.findByPk).toHaveBeenCalledWith(1);
            expect(result.query).toBe("node");
            expect(result.totalResults).toBe(2);
            expect(result.courses).toHaveLength(1);
            expect(result.topics).toHaveLength(1);
        });

        it("should throw 404 if user not found", async () => {
            User.findByPk.mockResolvedValue(null);

            await expect(searchService.searchAll(99, "node")).rejects.toThrow("User not found");
        });
    });
});
