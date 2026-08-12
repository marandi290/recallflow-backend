const request = require("supertest");
const app = require("../../src/app");
const dashboardService = require("../../src/services/dashboardService");

jest.mock("../../src/services/dashboardService");

describe("Dashboard API Integration Tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /api/v1/dashboard/today", () => {
        it("should return 200 OK and dashboard data", async () => {
            const mockDashboard = {
                todayStudyEntriesCount: 2,
                todayRevisionsCount: 1,
                pendingRevisionsCount: 6,
                missedRevisionsCount: 2,
                upcomingRevisionsCount: 5,
                dailyStudyTimeMinutes: 75,
                todayStudyEntries: [],
                todayRevisions: [],
            };
            dashboardService.getTodayDashboard.mockResolvedValue(mockDashboard);

            const res = await request(app).get("/api/v1/dashboard/today?user_id=1");

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                success: true,
                message: "Today's dashboard fetched successfully",
                data: mockDashboard,
            });
            expect(dashboardService.getTodayDashboard).toHaveBeenCalledWith(1);
        });

        it("should return 400 Bad Request when user_id query param is missing", async () => {
            const res = await request(app).get("/api/v1/dashboard/today");

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });
});
