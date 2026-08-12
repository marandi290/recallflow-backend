const request = require("supertest");
const app = require("../../src/app");

describe("AI API Integration Tests", () => {
    describe("POST /api/v1/ai/flashcards", () => {
        it("should return 200 OK and generated flashcards", async () => {
            const res = await request(app)
                .post("/api/v1/ai/flashcards")
                .send({
                    topic_title: "System Architecture",
                    study_notes: "Microservices enable independent deployment and scaling.",
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.flashcards.length).toBeGreaterThan(0);
        });

        it("should return 400 Bad Request when topic_title is missing", async () => {
            const res = await request(app)
                .post("/api/v1/ai/flashcards")
                .send({ study_notes: "Missing topic" });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe("POST /api/v1/ai/quiz", () => {
        it("should return 200 OK and generated quiz questions", async () => {
            const res = await request(app)
                .post("/api/v1/ai/quiz")
                .send({
                    topic_title: "Database Indexing",
                    study_notes: "B-Trees reduce lookup time from O(N) to O(log N).",
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.questions.length).toBe(2);
        });
    });

    describe("POST /api/v1/ai/summary", () => {
        it("should return 200 OK and summary key takeaways", async () => {
            const res = await request(app)
                .post("/api/v1/ai/summary")
                .send({
                    topic_title: "REST APIs",
                    study_notes: "Stateless operations with HTTP methods.",
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.keyTakeaways.length).toBeGreaterThan(0);
        });
    });
});
