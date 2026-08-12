jest.mock("../../../src/models", () => ({
    User: {
        findByPk: jest.fn(),
    },
    StudyEntry: {
        findAll: jest.fn(),
    },
    Revision: {
        findAll: jest.fn(),
        count: jest.fn(),
    },
    Topic: {},
    Course: {},
}));

const { User, StudyEntry, Revision } = require("../../../src/models");
const dashboardService = require("../../../src/services/dashboardService");

describe("DashboardService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getTodayDashboard", () => {
        it("should return aggregated daily metrics successfully", async () => {
            User.findByPk.mockResolvedValue({ id: 1 });
            StudyEntry.findAll.mockResolvedValue([
                { id: 1, duration_minutes: 30 },
                { id: 2, duration_minutes: 45 },
            ]);
            Revision.findAll.mockResolvedValue([{ id: 1, status: "pending" }]);
            Revision.count
                .mockResolvedValueOnce(2) // missed
                .mockResolvedValueOnce(5) // upcoming
                .mockResolvedValueOnce(6); // pending

            const result = await dashboardService.getTodayDashboard(1);

            expect(User.findByPk).toHaveBeenCalledWith(1);
            expect(result).toEqual({
                todayStudyEntriesCount: 2,
                todayRevisionsCount: 1,
                pendingRevisionsCount: 6,
                missedRevisionsCount: 2,
                upcomingRevisionsCount: 5,
                dailyStudyTimeMinutes: 75,
                todayStudyEntries: expect.any(Array),
                todayRevisions: expect.any(Array),
            });
        });

        it("should throw 404 if user not found", async () => {
            User.findByPk.mockResolvedValue(null);

            await expect(dashboardService.getTodayDashboard(99)).rejects.toThrow("User not found");
        });
    });
});
