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

            const res = await request(app).get("/api/v1/payments/status?userId=1");

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                success: true,
                data: mockStatus,
            });
            expect(paymentService.getSubscriptionStatus).toHaveBeenCalledWith("1");
        });
    });

    describe("POST /api/create-order and /api/v1/payments/create-order", () => {
        it("should create Razorpay order successfully via /api/create-order", async () => {
            const mockOrder = {
                order_id: "order_mock_123",
                orderId: "order_mock_123",
                amount: 500,
                currency: "INR",
                key_id: "rzp_test_TkA6xE3MDke4M1",
                keyId: "rzp_test_TkA6xE3MDke4M1",
            };
            paymentService.createOrder.mockResolvedValue(mockOrder);

            const res = await request(app)
                .post("/api/create-order")
                .send({ userId: 1, amount: 500 });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.order_id).toBe("order_mock_123");
            expect(res.body.amount).toBe(500);
            expect(paymentService.createOrder).toHaveBeenCalledWith(1, { userId: 1, amount: 500 });
        });

        it("should create Razorpay order via /api/v1/payments/create-order", async () => {
            const mockOrder = {
                order_id: "order_mock_456",
                orderId: "order_mock_456",
                amount: 500,
                currency: "INR",
                key_id: "rzp_test_TkA6xE3MDke4M1",
                keyId: "rzp_test_TkA6xE3MDke4M1",
            };
            paymentService.createOrder.mockResolvedValue(mockOrder);

            const res = await request(app)
                .post("/api/v1/payments/create-order")
                .send({ userId: 1 });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.order_id).toBe("order_mock_456");
            expect(paymentService.createOrder).toHaveBeenCalledWith(1, { userId: 1 });
        });
    });

    describe("POST /api/verify-payment and /api/v1/payments/verify", () => {
        it("should verify payment successfully via /api/verify-payment", async () => {
            const mockResult = {
                message: "Payment verified successfully",
                subscription: {
                    hasAccess: true,
                    plan: "active",
                },
            };
            paymentService.verifyPayment.mockResolvedValue(mockResult);

            const res = await request(app)
                .post("/api/verify-payment")
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

        it("should verify payment successfully via /api/v1/payments/verify", async () => {
            const mockResult = {
                message: "Payment verified successfully",
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
            expect(res.body.success).toBe(true);
            expect(paymentService.verifyPayment).toHaveBeenCalledWith(
                1,
                expect.objectContaining({ razorpay_order_id: "order_mock_123" })
            );
        });
    });

    describe("GET /api/v1/payments/history", () => {
        it("should return payment history", async () => {
            const mockHistory = [{ id: 1, amount: 5.0, status: "captured" }];
            paymentService.getPaymentHistory.mockResolvedValue(mockHistory);

            const res = await request(app).get("/api/v1/payments/history?userId=1");

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                success: true,
                data: mockHistory,
            });
            expect(paymentService.getPaymentHistory).toHaveBeenCalledWith("1");
        });
    });
});
