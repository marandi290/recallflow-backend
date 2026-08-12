const aiService = require("../../../src/services/aiService");

describe("AIService Unit Tests", () => {
    describe("generateFlashcards", () => {
        it("should generate flashcards from study notes", async () => {
            const input = {
                topic_title: "Express Middleware",
                study_notes: "Middleware functions have access to req and res. Next passes control to next handler.",
            };

            const result = await aiService.generateFlashcards(input);

            expect(result.topic_title).toBe("Express Middleware");
            expect(result.flashcards.length).toBeGreaterThan(0);
            expect(result.flashcards[0]).toHaveProperty("question");
            expect(result.flashcards[0]).toHaveProperty("answer");
        });
    });

    describe("generateQuiz", () => {
        it("should generate quiz questions for a topic", async () => {
            const input = {
                topic_title: "Spaced Repetition",
                study_notes: "Revising at increasing intervals improves long term retention.",
            };

            const result = await aiService.generateQuiz(input);

            expect(result.topic_title).toBe("Spaced Repetition");
            expect(result.questions.length).toBe(2);
            expect(result.questions[0]).toHaveProperty("options");
        });
    });

    describe("generateSummary", () => {
        it("should generate concise study summary", async () => {
            const input = {
                topic_title: "Sequelize ORM",
                study_notes: "Sequelize is a promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite and SQL Server.",
            };

            const result = await aiService.generateSummary(input);

            expect(result.topic_title).toBe("Sequelize ORM");
            expect(result).toHaveProperty("keyTakeaways");
            expect(result.keyTakeaways.length).toBeGreaterThan(0);
        });
    });
});
