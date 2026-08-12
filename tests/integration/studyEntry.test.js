const request = require("supertest");
const app = require("../../src/app");
const studyEntryService = require("../../src/services/studyEntryService");
const ApiError = require("../../src/utils/ApiError");
const httpStatus = require("../../src/constants/httpStatus");

jest.mock("../../src/services/studyEntryService");

describe("StudyEntry API Integration Tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /api/v1/study-entries", () => {
        const validPayload = {
            topic_id: 1,
            study_date: "2026-08-11",
            duration_minutes: 45,
            difficulty: "medium",
            study_notes: "Completed session on Express routing",
        };

        it("should return 201 Created on valid payload", async () => {
            const createdEntry = { id: 1, ...validPayload, study_date: new Date("2026-08-11") };
            studyEntryService.createStudyEntry.mockResolvedValue(createdEntry);

            const res = await request(app)
                .post("/api/v1/study-entries")
                .send(validPayload);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Study entry created successfully");
            expect(studyEntryService.createStudyEntry).toHaveBeenCalledWith({
                ...validPayload,
                study_date: new Date(validPayload.study_date),
            });
        });

        it("should return 400 Bad Request when difficulty is invalid", async () => {
            const res = await request(app)
                .post("/api/v1/study-entries")
                .send({ ...validPayload, difficulty: "super_hard" });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(studyEntryService.createStudyEntry).not.toHaveBeenCalled();
        });

        it("should return 404 Not Found when topic does not exist", async () => {
            studyEntryService.createStudyEntry.mockRejectedValue(
                new ApiError(httpStatus.NOT_FOUND, "Topic not found")
            );

            const res = await request(app)
                .post("/api/v1/study-entries")
                .send(validPayload);

            expect(res.status).toBe(404);
            expect(res.body).toEqual({
                success: false,
                message: "Topic not found",
            });
        });
    });

    describe("GET /api/v1/study-entries", () => {
        it("should return 200 OK and list of study entries", async () => {
            const mockEntries = [
                { id: 1, topic_id: 1, duration_minutes: 30, difficulty: "easy" },
            ];
            studyEntryService.getAllStudyEntries.mockResolvedValue(mockEntries);

            const res = await request(app).get("/api/v1/study-entries?topic_id=1");

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                success: true,
                message: "Study entries fetched successfully",
                data: mockEntries,
            });
            expect(studyEntryService.getAllStudyEntries).toHaveBeenCalledWith(1);
        });

        it("should return 400 Bad Request when topic_id query param is missing", async () => {
            const res = await request(app).get("/api/v1/study-entries");

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(studyEntryService.getAllStudyEntries).not.toHaveBeenCalled();
        });
    });

    describe("GET /api/v1/study-entries/:studyEntryId", () => {
        it("should return 200 OK and study entry data", async () => {
            const mockEntry = { id: 1, topic_id: 1, duration_minutes: 45, difficulty: "medium" };
            studyEntryService.getStudyEntryById.mockResolvedValue(mockEntry);

            const res = await request(app).get("/api/v1/study-entries/1");

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                success: true,
                message: "Study entry fetched successfully",
                data: mockEntry,
            });
            expect(studyEntryService.getStudyEntryById).toHaveBeenCalledWith(1);
        });

        it("should return 404 Not Found when study entry does not exist", async () => {
            studyEntryService.getStudyEntryById.mockRejectedValue(
                new ApiError(httpStatus.NOT_FOUND, "Study entry not found")
            );

            const res = await request(app).get("/api/v1/study-entries/99");

            expect(res.status).toBe(404);
            expect(res.body).toEqual({
                success: false,
                message: "Study entry not found",
            });
        });
    });

    describe("PUT /api/v1/study-entries/:studyEntryId", () => {
        it("should return 200 OK and updated study entry", async () => {
            const updatePayload = { duration_minutes: 60 };
            const updatedEntry = { id: 1, topic_id: 1, duration_minutes: 60, difficulty: "medium" };
            studyEntryService.updateStudyEntryById.mockResolvedValue(updatedEntry);

            const res = await request(app)
                .put("/api/v1/study-entries/1")
                .send(updatePayload);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                success: true,
                message: "Study entry updated successfully",
                data: updatedEntry,
            });
            expect(studyEntryService.updateStudyEntryById).toHaveBeenCalledWith(1, updatePayload);
        });
    });

    describe("DELETE /api/v1/study-entries/:studyEntryId", () => {
        it("should return 200 OK and deleted study entry", async () => {
            const deletedEntry = { id: 1, topic_id: 1, duration_minutes: 45, difficulty: "medium" };
            studyEntryService.deleteStudyEntryById.mockResolvedValue(deletedEntry);

            const res = await request(app).delete("/api/v1/study-entries/1");

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                success: true,
                message: "Study entry deleted successfully",
                data: deletedEntry,
            });
            expect(studyEntryService.deleteStudyEntryById).toHaveBeenCalledWith(1);
        });
    });
});
