const request = require("supertest");
const app = require("../../src/app");
const paymentService = require("../../src/services/paymentService");

jest.mock("../../src/services/paymentService");

describe("Payments API Integration Tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /api/v1/payments/status", () => {
        it("should return subscription status successfully", async () => {
            const mockStatus = {
                hasAccess: true,
                plan: "trial",
                daysRemainingInTrial: 6,
                amount: 5,
                currency: "INR",
            };
            paymentService.getSubscriptionStatus.mockResolvedValue(mockStatus);

            const res = await request(app)
                .get("/api/v1/payments/status?userId=1");

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                success: true,
                data: mockStatus,
            });
            expect(paymentService.getSubscriptionStatus).toHaveBeenCalledWith("1");
        });
    });

    describe("POST /api/v1/payments/create-order", () => {
        it("should create Razorpay order successfully", async () => {
            const mockOrder = {
                orderId: "order_mock_123",
                amount: 500,
                currency: "INR",
                keyId: "rzp_test_placeholder",
            };
            paymentService.createOrder.mockResolvedValue(mockOrder);

            const res = await request(app)
                .post("/api/v1/payments/create-order")
                .send({ userId: 1 });

            expect(res.status).toBe(201);
            expect(res.body).toEqual({
                success: true,
                message: "Razorpay order created successfully",
                data: mockOrder,
            });
            expect(paymentService.createOrder).toHaveBeenCalledWith(1);
        });
    });

    describe("POST /api/v1/payments/verify", () => {
        it("should verify payment and return updated subscription", async () => {
            const mockResult = {
                message: "Payment verified successfully. Subscription active for 30 days.",
                subscription: {
                    hasAccess: true,
                    plan: "active",
                },
            };
            paymentService.verifyPayment.mockResolvedValue(mockResult);

            const res = await request(app)
                .post("/api/v1/payments/verify")
                .send({
                    userId: 1,
                    razorpay_order_id: "order_mock_123",
                    razorpay_payment_id: "pay_mock_123",
                    razorpay_signature: "sig_mock_123",
                });

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                success: true,
                message: mockResult.message,
                data: mockResult.subscription,
            });
            expect(paymentService.verifyPayment).toHaveBeenCalledWith(
                1,
                expect.objectContaining({ razorpay_order_id: "order_mock_123" })
            );
        });
    });

    describe("GET /api/v1/payments/history", () => {
        it("should return payment history", async () => {
            const mockHistory = [
                { id: 1, amount: 5.0, status: "captured" },
            ];
            paymentService.getPaymentHistory.mockResolvedValue(mockHistory);

            const res = await request(app)
                .get("/api/v1/payments/history?userId=1");

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                success: true,
                data: mockHistory,
            });
            expect(paymentService.getPaymentHistory).toHaveBeenCalledWith("1");
        });
    });
});
