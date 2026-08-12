jest.mock("../../../src/models", () => ({
    User: {
        findByPk: jest.fn(),
    },
    Course: {
        count: jest.fn(),
    },
    Topic: {
        count: jest.fn(),
    },
    StudyEntry: {
        findAll: jest.fn(),
    },
    Revision: {
        findAll: jest.fn(),
    },
}));

const { User, Course, Topic, StudyEntry, Revision } = require("../../../src/models");
const analyticsService = require("../../../src/services/analyticsService");

describe("AnalyticsService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getOverview", () => {
        it("should return analytics overview metrics successfully", async () => {
            const userId = 1;
            User.findByPk.mockResolvedValue({ id: 1, name: "Prakash" });
            Course.count.mockResolvedValueOnce(3).mockResolvedValueOnce(1); // total, completed
            Topic.count.mockResolvedValue(10);
            StudyEntry.findAll.mockResolvedValue([
                { id: 1, duration_minutes: 120, study_date: new Date() },
                { id: 2, duration_minutes: 60, study_date: new Date() },
            ]);
            Revision.findAll.mockResolvedValue([
                { id: 1, status: "completed", revision_date: "2026-08-10" },
                { id: 2, status: "missed", revision_date: "2026-08-09" },
            ]);

            const result = await analyticsService.getOverview(userId);

            expect(User.findByPk).toHaveBeenCalledWith(1);
            expect(result.totalCourses).toBe(3);
            expect(result.completedCourses).toBe(1);
            expect(result.totalTopics).toBe(10);
            expect(result.totalStudyHours).toBe(3);
            expect(result.totalStudyMinutes).toBe(180);
            expect(result.revisionCompletionRate).toBe(50);
            expect(result.missedRevisionRate).toBe(50);
        });

        it("should throw 404 if user not found", async () => {
            User.findByPk.mockResolvedValue(null);

            await expect(analyticsService.getOverview(99)).rejects.toThrow("User not found");
        });
    });

    describe("getWeekly", () => {
        it("should return 7-day breakdown", async () => {
            User.findByPk.mockResolvedValue({ id: 1 });
            StudyEntry.findAll.mockResolvedValue([]);
            Revision.findAll.mockResolvedValue([]);

            const result = await analyticsService.getWeekly(1);

            expect(result).toHaveLength(7);
            expect(result[0]).toHaveProperty("date");
            expect(result[0]).toHaveProperty("studyMinutes");
            expect(result[0]).toHaveProperty("revisionsCompleted");
        });
    });

    describe("getMonthly", () => {
        it("should return 30-day breakdown", async () => {
            User.findByPk.mockResolvedValue({ id: 1 });
            StudyEntry.findAll.mockResolvedValue([]);
            Revision.findAll.mockResolvedValue([]);

            const result = await analyticsService.getMonthly(1);

            expect(result).toHaveLength(30);
        });
    });
});
