const request = require("supertest");
const app = require("../../src/app");
const calendarService = require("../../src/services/calendarService");

jest.mock("../../src/services/calendarService");

describe("Calendar API Integration Tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /api/v1/calendar", () => {
        it("should return 200 OK and monthly calendar data", async () => {
            const mockCalendar = {
                year: 2026,
                month: 8,
                days: [],
            };
            calendarService.getMonthCalendar.mockResolvedValue(mockCalendar);

            const res = await request(app).get("/api/v1/calendar?user_id=1&year=2026&month=8");

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                success: true,
                message: "Monthly calendar fetched successfully",
                data: mockCalendar,
            });
            expect(calendarService.getMonthCalendar).toHaveBeenCalledWith(1, 2026, 8);
        });

        it("should return 400 Bad Request when month is missing or invalid", async () => {
            const res = await request(app).get("/api/v1/calendar?user_id=1&year=2026&month=13");

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(calendarService.getMonthCalendar).not.toHaveBeenCalled();
        });
    });
});
