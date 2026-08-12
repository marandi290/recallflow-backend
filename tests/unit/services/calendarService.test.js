jest.mock("../../../src/models", () => ({
    User: {
        findByPk: jest.fn(),
    },
    StudyEntry: {
        findAll: jest.fn(),
    },
    Revision: {
        findAll: jest.fn(),
    },
    Topic: {},
    Course: {},
}));

const { User, StudyEntry, Revision } = require("../../../src/models");
const calendarService = require("../../../src/services/calendarService");

describe("CalendarService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getMonthCalendar", () => {
        it("should return monthly calendar data for valid user and date range", async () => {
            User.findByPk.mockResolvedValue({ id: 1 });
            StudyEntry.findAll.mockResolvedValue([
                { id: 1, duration_minutes: 45, study_date: new Date("2026-08-11T10:00:00.000Z") },
            ]);
            Revision.findAll.mockResolvedValue([
                { id: 1, revision_date: "2026-08-11", status: "completed" },
            ]);

            const result = await calendarService.getMonthCalendar(1, 2026, 8);

            expect(User.findByPk).toHaveBeenCalledWith(1);
            expect(result.year).toBe(2026);
            expect(result.month).toBe(8);
            expect(result.days).toHaveLength(31); // August has 31 days

            const august11 = result.days.find((d) => d.date === "2026-08-11");
            expect(august11).toBeDefined();
            expect(august11.studyEntriesCount).toBe(1);
            expect(august11.studyMinutes).toBe(45);
            expect(august11.completedRevisionsCount).toBe(1);
        });

        it("should throw 404 if user not found", async () => {
            User.findByPk.mockResolvedValue(null);

            await expect(calendarService.getMonthCalendar(99, 2026, 8)).rejects.toThrow("User not found");
        });
    });
});
