const request = require("supertest");
const app = require("../../src/app");
const notificationService = require("../../src/services/notificationService");

jest.mock("../../src/services/notificationService");

describe("Notification API Integration Tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /api/v1/notifications", () => {
        it("should return 200 OK and notification list", async () => {
            const mockNotifications = {
                unreadCount: 1,
                notifications: [
                    {
                        id: "due-today-2026-08-12",
                        type: "DUE_TODAY",
                        title: "Revisions Due Today",
                        message: "You have 1 revision(s) scheduled for today.",
                    },
                ],
            };
            notificationService.getUserNotifications.mockResolvedValue(mockNotifications);

            const res = await request(app).get("/api/v1/notifications?user_id=1");

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                success: true,
                message: "Notifications fetched successfully",
                data: mockNotifications,
            });
            expect(notificationService.getUserNotifications).toHaveBeenCalledWith(1);
        });

        it("should return 400 Bad Request when user_id is missing", async () => {
            const res = await request(app).get("/api/v1/notifications");

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(notificationService.getUserNotifications).not.toHaveBeenCalled();
        });
    });
});
