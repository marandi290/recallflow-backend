jest.mock("../../../src/models", () => ({
    User: {
        findByPk: jest.fn(),
    },
    Revision: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
    },
    StudyEntry: {},
    Topic: {},
    Course: {},
}));

const { User, Revision } = require("../../../src/models");
const revisionService = require("../../../src/services/revisionService");

describe("RevisionService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getTodayRevisions", () => {
        it("should return today's revisions for user", async () => {
            const userId = 1;
            const revisions = [{ id: 1, revision_date: "2026-08-11", status: "pending" }];

            User.findByPk.mockResolvedValue({ id: 1 });
            Revision.findAll.mockResolvedValue(revisions);

            const result = await revisionService.getTodayRevisions(userId);

            expect(User.findByPk).toHaveBeenCalledWith(1);
            expect(Revision.findAll).toHaveBeenCalled();
            expect(result).toEqual(revisions);
        });

        it("should throw 404 if user not found", async () => {
            User.findByPk.mockResolvedValue(null);

            await expect(revisionService.getTodayRevisions(99)).rejects.toThrow("User not found");
        });
    });

    describe("getUpcomingRevisions", () => {
        it("should return upcoming revisions for user", async () => {
            User.findByPk.mockResolvedValue({ id: 1 });
            Revision.findAll.mockResolvedValue([{ id: 2, status: "pending" }]);

            const result = await revisionService.getUpcomingRevisions(1);

            expect(Revision.findAll).toHaveBeenCalled();
            expect(result).toHaveLength(1);
        });
    });

    describe("getMissedRevisions", () => {
        it("should return missed revisions for user", async () => {
            User.findByPk.mockResolvedValue({ id: 1 });
            Revision.findAll.mockResolvedValue([{ id: 3, status: "missed" }]);

            const result = await revisionService.getMissedRevisions(1);

            expect(Revision.findAll).toHaveBeenCalled();
            expect(result).toHaveLength(1);
        });
    });

    describe("getRevisionById", () => {
        it("should return revision by id", async () => {
            const revision = { id: 1, status: "pending" };
            Revision.findByPk.mockResolvedValue(revision);

            const result = await revisionService.getRevisionById(1);

            expect(Revision.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
            expect(result).toEqual(revision);
        });

        it("should throw 404 if revision not found", async () => {
            Revision.findByPk.mockResolvedValue(null);

            await expect(revisionService.getRevisionById(99)).rejects.toThrow("Revision not found");
        });
    });

    describe("completeRevision", () => {
        it("should mark revision as completed", async () => {
            const mockSave = jest.fn().mockResolvedValue({ id: 1, status: "completed" });
            const mockRevision = { id: 1, status: "pending", save: mockSave };

            Revision.findByPk.mockResolvedValue(mockRevision);

            const result = await revisionService.completeRevision(1, { revision_notes: "Reviewed successfully" });

            expect(mockRevision.status).toBe("completed");
            expect(mockRevision.revision_notes).toBe("Reviewed successfully");
            expect(mockSave).toHaveBeenCalled();
        });
    });
});
