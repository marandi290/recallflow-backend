jest.mock("../../../src/models", () => ({
    User: {
        findByPk: jest.fn(),
    },
    Revision: {
        findAll: jest.fn(),
    },
    StudyEntry: {
        findAll: jest.fn(),
    },
    Topic: {},
    Course: {},
}));

const { User, Revision, StudyEntry } = require("../../../src/models");
const notificationService = require("../../../src/services/notificationService");

describe("NotificationService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getUserNotifications", () => {
        it("should return notifications for due revisions, missed revisions, and study reminder", async () => {
            User.findByPk.mockResolvedValue({ id: 1 });
            Revision.findAll
                .mockResolvedValueOnce([{ id: 1, status: "pending" }]) // due today
                .mockResolvedValueOnce([{ id: 2, status: "missed" }]); // missed
            StudyEntry.findAll.mockResolvedValue([]); // no study entries today

            const result = await notificationService.getUserNotifications(1);

            expect(User.findByPk).toHaveBeenCalledWith(1);
            expect(result.unreadCount).toBe(3);
            expect(result.notifications).toHaveLength(3);
            expect(result.notifications[0].type).toBe("DUE_TODAY");
            expect(result.notifications[1].type).toBe("MISSED_REVISION");
            expect(result.notifications[2].type).toBe("STUDY_REMINDER");
        });

        it("should throw 404 if user not found", async () => {
            User.findByPk.mockResolvedValue(null);

            await expect(notificationService.getUserNotifications(99)).rejects.toThrow("User not found");
        });
    });
});
