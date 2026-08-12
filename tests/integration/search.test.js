const request = require("supertest");
const app = require("../../src/app");
const searchService = require("../../src/services/searchService");

jest.mock("../../src/services/searchService");

describe("Search API Integration Tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /api/v1/search", () => {
        it("should return 200 OK and search results", async () => {
            const mockSearchData = {
                query: "node",
                totalResults: 1,
                courses: [{ id: 1, title: "Node.js" }],
                topics: [],
                studyEntries: [],
                revisions: [],
            };
            searchService.searchAll.mockResolvedValue(mockSearchData);

            const res = await request(app).get("/api/v1/search?user_id=1&q=node");

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                success: true,
                message: "Search completed successfully",
                data: mockSearchData,
            });
            expect(searchService.searchAll).toHaveBeenCalledWith(1, "node");
        });

        it("should return 400 Bad Request when search query q is missing", async () => {
            const res = await request(app).get("/api/v1/search?user_id=1");

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(searchService.searchAll).not.toHaveBeenCalled();
        });
    });
});
