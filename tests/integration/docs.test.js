const request = require("supertest");
const app = require("../../src/app");

describe("Swagger Documentation API", () => {
    it("should serve Swagger UI at /api-docs", async () => {
        const res = await request(app).get("/api-docs/");

        expect(res.status).toBe(200);
        expect(res.text).toContain("Swagger UI");
    });
});
