const request = require("supertest");
const app = require("../../src/app");
const authService = require("../../src/services/authService");
const ApiError = require("../../src/utils/ApiError");
const httpStatus = require("../../src/constants/httpStatus");

jest.mock("../../src/services/authService");

describe("Auth API Integration Tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /api/v1/auth/register", () => {
        const registerPayload = {
            name: "Prakash",
            email: "prakash@example.com",
            password: "password123",
        };

        it("should return 201 Created and JWT token on successful registration", async () => {
            const mockAuthResult = {
                user: { id: 1, name: "Prakash", email: "prakash@example.com" },
                token: "mock_jwt_token",
            };
            authService.register.mockResolvedValue(mockAuthResult);

            const res = await request(app)
                .post("/api/v1/auth/register")
                .send(registerPayload);

            expect(res.status).toBe(201);
            expect(res.body).toEqual({
                success: true,
                message: "User registered successfully",
                data: mockAuthResult,
            });
            expect(authService.register).toHaveBeenCalledWith(registerPayload);
        });

        it("should return 400 Bad Request on invalid email", async () => {
            const res = await request(app)
                .post("/api/v1/auth/register")
                .send({ ...registerPayload, email: "invalid-email" });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(authService.register).not.toHaveBeenCalled();
        });

        it("should return 409 Conflict when email already exists", async () => {
            authService.register.mockRejectedValue(
                new ApiError(httpStatus.CONFLICT, "Email is already registered")
            );

            const res = await request(app)
                .post("/api/v1/auth/register")
                .send(registerPayload);

            expect(res.status).toBe(409);
            expect(res.body).toEqual({
                success: false,
                message: "Email is already registered",
            });
        });
    });

    describe("POST /api/v1/auth/login", () => {
        const loginPayload = {
            email: "prakash@example.com",
            password: "password123",
        };

        it("should return 200 OK and JWT token on valid credentials", async () => {
            const mockAuthResult = {
                user: { id: 1, name: "Prakash", email: "prakash@example.com" },
                token: "mock_jwt_token",
            };
            authService.login.mockResolvedValue(mockAuthResult);

            const res = await request(app)
                .post("/api/v1/auth/login")
                .send(loginPayload);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                success: true,
                message: "Login successful",
                data: mockAuthResult,
            });
            expect(authService.login).toHaveBeenCalledWith(loginPayload);
        });

        it("should return 401 Unauthorized on invalid credentials", async () => {
            authService.login.mockRejectedValue(
                new ApiError(httpStatus.UNAUTHORIZED, "Invalid email or password")
            );

            const res = await request(app)
                .post("/api/v1/auth/login")
                .send(loginPayload);

            expect(res.status).toBe(401);
            expect(res.body).toEqual({
                success: false,
                message: "Invalid email or password",
            });
        });
    });

    describe("GET /api/v1/auth/me", () => {
        it("should return 401 Unauthorized when Bearer token is missing", async () => {
            const res = await request(app).get("/api/v1/auth/me");

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });
});
