const request = require("supertest");
const app = require("../../src/app");
const revisionService = require("../../src/services/revisionService");
const ApiError = require("../../src/utils/ApiError");
const httpStatus = require("../../src/constants/httpStatus");

jest.mock("../../src/services/revisionService");

describe("Revision API Integration Tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /api/v1/revisions/today", () => {
        it("should return 200 OK and today's revisions", async () => {
            const mockRevisions = [{ id: 1, revision_date: "2026-08-11" }];
            revisionService.getTodayRevisions.mockResolvedValue(mockRevisions);

            const res = await request(app).get("/api/v1/revisions/today?user_id=1");

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                success: true,
                message: "Today's revisions fetched successfully",
                data: mockRevisions,
            });
            expect(revisionService.getTodayRevisions).toHaveBeenCalledWith(1);
        });

        it("should return 400 Bad Request when user_id is missing", async () => {
            const res = await request(app).get("/api/v1/revisions/today");

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe("GET /api/v1/revisions/upcoming", () => {
        it("should return 200 OK and upcoming revisions", async () => {
            revisionService.getUpcomingRevisions.mockResolvedValue([]);

            const res = await request(app).get("/api/v1/revisions/upcoming?user_id=1");

            expect(res.status).toBe(200);
            expect(revisionService.getUpcomingRevisions).toHaveBeenCalledWith(1);
        });
    });

    describe("GET /api/v1/revisions/missed", () => {
        it("should return 200 OK and missed revisions", async () => {
            revisionService.getMissedRevisions.mockResolvedValue([]);

            const res = await request(app).get("/api/v1/revisions/missed?user_id=1");

            expect(res.status).toBe(200);
            expect(revisionService.getMissedRevisions).toHaveBeenCalledWith(1);
        });
    });

    describe("GET /api/v1/revisions/:revisionId", () => {
        it("should return 200 OK and revision by id", async () => {
            const mockRevision = { id: 1, status: "pending" };
            revisionService.getRevisionById.mockResolvedValue(mockRevision);

            const res = await request(app).get("/api/v1/revisions/1");

            expect(res.status).toBe(200);
            expect(res.body.data).toEqual(mockRevision);
            expect(revisionService.getRevisionById).toHaveBeenCalledWith(1);
        });
    });

    describe("PATCH /api/v1/revisions/:revisionId/complete", () => {
        it("should return 200 OK and complete revision", async () => {
            const completedRevision = { id: 1, status: "completed" };
            revisionService.completeRevision.mockResolvedValue(completedRevision);

            const res = await request(app)
                .patch("/api/v1/revisions/1/complete")
                .send({ revision_notes: "Done" });

            expect(res.status).toBe(200);
            expect(res.body.data).toEqual(completedRevision);
            expect(revisionService.completeRevision).toHaveBeenCalledWith(1, { revision_notes: "Done" });
        });
    });
});
