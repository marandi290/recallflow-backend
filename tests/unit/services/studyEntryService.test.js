jest.mock("../../../src/models", () => ({
    Course: {
        findByPk: jest.fn(),
    },
    Topic: {
        findByPk: jest.fn(),
    },
    StudyEntry: {
        findByPk: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
    },
    Revision: {
        bulkCreate: jest.fn(),
    },
}));

const { Topic, StudyEntry, Revision } = require("../../../src/models");
const studyEntryService = require("../../../src/services/studyEntryService");

describe("StudyEntryService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("createStudyEntry", () => {
        it("should create a study entry and schedule revisions successfully", async () => {
            const input = {
                topic_id: 1,
                study_date: new Date("2026-08-11"),
                duration_minutes: 45,
                difficulty: "medium",
                study_notes: "Learned about middleware order",
            };

            const createdEntry = { id: 1, ...input, toJSON: () => ({ id: 1, ...input }) };
            const mockTopic = { id: 1, title: "Middleware", course: { algorithm: "three_month" } };
            const mockRevisions = [
                { id: 1, study_entry_id: 1, revision_number: 1, revision_date: "2026-08-14" },
            ];

            Topic.findByPk.mockResolvedValue(mockTopic);
            StudyEntry.create.mockResolvedValue(createdEntry);
            Revision.bulkCreate.mockResolvedValue(mockRevisions);

            const result = await studyEntryService.createStudyEntry(input);

            expect(Topic.findByPk).toHaveBeenCalledWith(1, {
                include: expect.any(Array),
            });
            expect(StudyEntry.create).toHaveBeenCalledWith(input);
            expect(Revision.bulkCreate).toHaveBeenCalled();
            expect(result).toEqual({
                id: 1,
                ...input,
                revisions: mockRevisions,
            });
        });

        it("should throw 404 if topic does not exist", async () => {
            const input = { topic_id: 99, study_date: new Date(), duration_minutes: 30, difficulty: "easy" };

            Topic.findByPk.mockResolvedValue(null);

            await expect(studyEntryService.createStudyEntry(input)).rejects.toThrow("Topic not found");
            expect(Topic.findByPk).toHaveBeenCalledWith(99, {
                include: expect.any(Array),
            });
            expect(StudyEntry.create).not.toHaveBeenCalled();
        });
    });

    describe("getAllStudyEntries", () => {
        it("should return all study entries for a topic", async () => {
            const topicId = 1;
            const entries = [
                { id: 1, topic_id: 1, duration_minutes: 30, difficulty: "easy" },
                { id: 2, topic_id: 1, duration_minutes: 60, difficulty: "hard" },
            ];

            Topic.findByPk.mockResolvedValue({ id: 1 });
            StudyEntry.findAll.mockResolvedValue(entries);

            const result = await studyEntryService.getAllStudyEntries(topicId);

            expect(Topic.findByPk).toHaveBeenCalledWith(1);
            expect(StudyEntry.findAll).toHaveBeenCalledWith({
                where: { topic_id: 1 },
                order: [["study_date", "DESC"]],
            });
            expect(result).toEqual(entries);
        });

        it("should throw 404 if topic does not exist", async () => {
            Topic.findByPk.mockResolvedValue(null);

            await expect(studyEntryService.getAllStudyEntries(99)).rejects.toThrow("Topic not found");
            expect(StudyEntry.findAll).not.toHaveBeenCalled();
        });
    });

    describe("getStudyEntryById", () => {
        it("should return study entry by ID", async () => {
            const entry = { id: 1, topic_id: 1, duration_minutes: 45, difficulty: "medium" };
            StudyEntry.findByPk.mockResolvedValue(entry);

            const result = await studyEntryService.getStudyEntryById(1);

            expect(StudyEntry.findByPk).toHaveBeenCalledWith(1);
            expect(result).toEqual(entry);
        });

        it("should throw 404 if study entry not found", async () => {
            StudyEntry.findByPk.mockResolvedValue(null);

            await expect(studyEntryService.getStudyEntryById(99)).rejects.toThrow("Study entry not found");
        });
    });

    describe("updateStudyEntryById", () => {
        it("should update study entry successfully", async () => {
            const entryId = 1;
            const updateData = { duration_minutes: 60, difficulty: "hard" };
            const mockSave = jest.fn().mockResolvedValue({ id: 1, duration_minutes: 60, difficulty: "hard" });
            const mockEntry = { id: 1, duration_minutes: 45, difficulty: "medium", save: mockSave };

            StudyEntry.findByPk.mockResolvedValue(mockEntry);

            const result = await studyEntryService.updateStudyEntryById(entryId, updateData);

            expect(StudyEntry.findByPk).toHaveBeenCalledWith(1);
            expect(mockSave).toHaveBeenCalled();
            expect(result).toEqual({ id: 1, duration_minutes: 60, difficulty: "hard" });
        });

        it("should throw 404 if study entry to update does not exist", async () => {
            StudyEntry.findByPk.mockResolvedValue(null);

            await expect(studyEntryService.updateStudyEntryById(99, { duration_minutes: 60 })).rejects.toThrow(
                "Study entry not found"
            );
        });
    });

    describe("deleteStudyEntryById", () => {
        it("should delete study entry successfully", async () => {
            const mockDestroy = jest.fn().mockResolvedValue(true);
            const mockEntry = { id: 1, destroy: mockDestroy };

            StudyEntry.findByPk.mockResolvedValue(mockEntry);

            const result = await studyEntryService.deleteStudyEntryById(1);

            expect(StudyEntry.findByPk).toHaveBeenCalledWith(1);
            expect(mockDestroy).toHaveBeenCalled();
            expect(result).toEqual(mockEntry);
        });

        it("should throw 404 if study entry to delete does not exist", async () => {
            StudyEntry.findByPk.mockResolvedValue(null);

            await expect(studyEntryService.deleteStudyEntryById(99)).rejects.toThrow("Study entry not found");
        });
    });
});
