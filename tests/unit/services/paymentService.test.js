jest.mock("../../../src/models", () => ({
    User: {
        findByPk: jest.fn(),
    },
    Payment: {
        create: jest.fn(),
        findOne: jest.fn(),
        findAll: jest.fn(),
    },
}));

const { User, Payment } = require("../../../src/models");
const paymentService = require("../../../src/services/paymentService");

describe("PaymentService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getSubscriptionStatus", () => {
        it("should return trial active for newly created user within 7 days", async () => {
            const mockUser = {
                id: 1,
                name: "Test User",
                email: "test@example.com",
                createdAt: new Date(),
                trial_ends_at: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
                subscription_status: "trial",
                subscription_ends_at: null,
            };
            User.findByPk.mockResolvedValue(mockUser);

            const status = await paymentService.getSubscriptionStatus(1);

            expect(status.hasAccess).toBe(true);
            expect(status.plan).toBe("trial");
            expect(status.isTrialActive).toBe(true);
            expect(status.daysRemainingInTrial).toBeGreaterThan(0);
            expect(status.amount).toBe(5);
            expect(status.currency).toBe("INR");
        });

        it("should return expired when trial has ended and no subscription", async () => {
            const pastDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
            const mockUser = {
                id: 2,
                name: "Expired User",
                email: "expired@example.com",
                createdAt: pastDate,
                trial_ends_at: pastDate,
                subscription_status: "trial",
                subscription_ends_at: null,
            };
            User.findByPk.mockResolvedValue(mockUser);

            const status = await paymentService.getSubscriptionStatus(2);

            expect(status.hasAccess).toBe(false);
            expect(status.plan).toBe("expired");
            expect(status.isTrialActive).toBe(false);
            expect(status.daysRemainingInTrial).toBe(0);
        });

        it("should return active when user has valid paid subscription", async () => {
            const futureDate = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000);
            const mockUser = {
                id: 3,
                name: "Paid User",
                email: "paid@example.com",
                createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                trial_ends_at: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000),
                subscription_status: "active",
                subscription_ends_at: futureDate,
            };
            User.findByPk.mockResolvedValue(mockUser);

            const status = await paymentService.getSubscriptionStatus(3);

            expect(status.hasAccess).toBe(true);
            expect(status.plan).toBe("active");
            expect(status.isSubscriptionActive).toBe(true);
            expect(status.daysRemainingInSubscription).toBeGreaterThan(0);
        });
    });

    describe("createOrder", () => {
        it("should create an order for 500 paise (Rs. 5)", async () => {
            const mockUser = {
                id: 1,
                name: "Test User",
                email: "test@example.com",
            };
            User.findByPk.mockResolvedValue(mockUser);
            Payment.create.mockResolvedValue({ id: 10 });

            const order = await paymentService.createOrder(1);

            expect(order).toBeDefined();
            expect(order.amount).toBe(500); // 500 paise = Rs. 5
            expect(order.currency).toBe("INR");
            expect(order.orderId).toBeDefined();
            expect(Payment.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    user_id: 1,
                    amount: 5.0,
                    currency: "INR",
                    status: "created",
                })
            );
        });
    });

    describe("verifyPayment", () => {
        it("should verify payment and activate subscription for 30 days", async () => {
            const mockUser = {
                id: 1,
                subscription_status: "trial",
                subscription_ends_at: null,
                save: jest.fn().mockResolvedValue(true),
            };
            const mockPayment = {
                id: 1,
                user_id: 1,
                razorpay_order_id: "order_123",
                status: "created",
                save: jest.fn().mockResolvedValue(true),
            };

            User.findByPk.mockResolvedValue(mockUser);
            Payment.findOne.mockResolvedValue(mockPayment);

            const result = await paymentService.verifyPayment(1, {
                razorpay_order_id: "order_123",
                razorpay_payment_id: "pay_123",
                razorpay_signature: "sig_123",
            });

            expect(result.success).toBe(true);
            expect(mockPayment.status).toBe("captured");
            expect(mockUser.subscription_status).toBe("active");
            expect(mockUser.subscription_ends_at).toBeDefined();
            expect(mockPayment.save).toHaveBeenCalled();
            expect(mockUser.save).toHaveBeenCalled();
        });
    });

    describe("getPaymentHistory", () => {
        it("should return payments list for user", async () => {
            Payment.findAll.mockResolvedValue([
                { id: 1, amount: 5.0, status: "captured" },
            ]);

            const history = await paymentService.getPaymentHistory(1);

            expect(history).toHaveLength(1);
            expect(history[0].status).toBe("captured");
        });
    });
});
