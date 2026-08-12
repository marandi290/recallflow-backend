const request = require("supertest");
const app = require("../../src/app");
const analyticsService = require("../../src/services/analyticsService");

jest.mock("../../src/services/analyticsService");

describe("Analytics API Integration Tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /api/v1/analytics/overview", () => {
        it("should return 200 OK and analytics overview", async () => {
            const mockOverview = {
                totalCourses: 3,
                completedCourses: 1,
                totalTopics: 10,
                totalStudyHours: 3,
                learningStreakDays: 2,
                revisionCompletionRate: 85,
            };
            analyticsService.getOverview.mockResolvedValue(mockOverview);

            const res = await request(app).get("/api/v1/analytics/overview?user_id=1");

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                success: true,
                message: "Analytics overview fetched successfully",
                data: mockOverview,
            });
            expect(analyticsService.getOverview).toHaveBeenCalledWith(1);
        });

        it("should return 400 Bad Request when user_id query param is missing", async () => {
            const res = await request(app).get("/api/v1/analytics/overview");

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe("GET /api/v1/analytics/weekly", () => {
        it("should return 200 OK and weekly analytics data", async () => {
            analyticsService.getWeekly.mockResolvedValue([]);

            const res = await request(app).get("/api/v1/analytics/weekly?user_id=1");

            expect(res.status).toBe(200);
            expect(analyticsService.getWeekly).toHaveBeenCalledWith(1);
        });
    });

    describe("GET /api/v1/analytics/monthly", () => {
        it("should return 200 OK and monthly analytics data", async () => {
            analyticsService.getMonthly.mockResolvedValue([]);

            const res = await request(app).get("/api/v1/analytics/monthly?user_id=1");

            expect(res.status).toBe(200);
            expect(analyticsService.getMonthly).toHaveBeenCalledWith(1);
        });
    });
});
