jest.mock("../../../src/models", () => ({
    User: {
        findOne: jest.fn(),
        create: jest.fn(),
        findByPk: jest.fn(),
    },
}));

jest.mock("bcryptjs", () => ({
    hash: jest.fn(),
    compare: jest.fn(),
}));

const { User } = require("../../../src/models");
const bcrypt = require("bcryptjs");
const authService = require("../../../src/services/authService");

describe("AuthService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("register", () => {
        it("should register a new user successfully and return token", async () => {
            const input = {
                name: "Prakash",
                email: "prakash@example.com",
                password: "password123",
            };

            User.findOne.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue("hashedPassword123");

            const createdUser = {
                id: 1,
                name: input.name,
                email: input.email,
                password: "hashedPassword123",
                toJSON: () => ({ id: 1, name: input.name, email: input.email }),
            };
            User.create.mockResolvedValue(createdUser);

            const result = await authService.register(input);

            expect(User.findOne).toHaveBeenCalledWith({ where: { email: input.email } });
            expect(bcrypt.hash).toHaveBeenCalledWith(input.password, 10);
            expect(result).toHaveProperty("token");
            expect(result.user).toEqual({ id: 1, name: input.name, email: input.email });
        });

        it("should throw 409 if email is already registered", async () => {
            User.findOne.mockResolvedValue({ id: 1, email: "prakash@example.com" });

            await expect(
                authService.register({
                    name: "Prakash",
                    email: "prakash@example.com",
                    password: "password123",
                })
            ).rejects.toThrow("Email is already registered");
        });
    });

    describe("login", () => {
        it("should login user with correct credentials and return token", async () => {
            const mockUser = {
                id: 1,
                name: "Prakash",
                email: "prakash@example.com",
                password: "hashedPassword123",
                toJSON: () => ({ id: 1, name: "Prakash", email: "prakash@example.com" }),
            };

            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);

            const result = await authService.login({
                email: "prakash@example.com",
                password: "password123",
            });

            expect(User.findOne).toHaveBeenCalledWith({ where: { email: "prakash@example.com" } });
            expect(bcrypt.compare).toHaveBeenCalledWith("password123", "hashedPassword123");
            expect(result).toHaveProperty("token");
            expect(result.user.email).toBe("prakash@example.com");
        });

        it("should throw 401 on invalid email", async () => {
            User.findOne.mockResolvedValue(null);

            await expect(
                authService.login({ email: "wrong@example.com", password: "password123" })
            ).rejects.toThrow("Invalid email or password");
        });

        it("should throw 401 on invalid password", async () => {
            User.findOne.mockResolvedValue({ id: 1, password: "hashedPassword123" });
            bcrypt.compare.mockResolvedValue(false);

            await expect(
                authService.login({ email: "prakash@example.com", password: "wrongpassword" })
            ).rejects.toThrow("Invalid email or password");
        });
    });

    describe("getProfile", () => {
        it("should return user profile without password", async () => {
            const mockUser = { id: 1, name: "Prakash", email: "prakash@example.com" };
            User.findByPk.mockResolvedValue(mockUser);

            const result = await authService.getProfile(1);

            expect(User.findByPk).toHaveBeenCalledWith(1, {
                attributes: { exclude: ["password"] },
            });
            expect(result).toEqual(mockUser);
        });

        it("should throw 404 if user not found", async () => {
            User.findByPk.mockResolvedValue(null);

            await expect(authService.getProfile(99)).rejects.toThrow("User not found");
        });
    });
});
