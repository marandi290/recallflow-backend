const paymentService = require("../services/paymentService");
const asyncHandler = require("../middlewares/asyncHandler");

const getSubscriptionStatus = asyncHandler(async (req, res) => {
    const userId = req.user?.id || req.query.userId || 1;
    const status = await paymentService.getSubscriptionStatus(userId);

    return res.status(200).json({
        success: true,
        data: status,
    });
});

const createOrder = asyncHandler(async (req, res) => {
    const userId = req.user?.id || req.body.userId || 1;
    const orderData = await paymentService.createOrder(userId, req.body);

    return res.status(201).json({
        success: true,
        message: "Razorpay order created successfully",
        order_id: orderData.order_id,
        orderId: orderData.orderId,
        amount: orderData.amount,
        currency: orderData.currency,
        key_id: orderData.key_id,
        data: orderData,
    });
});

const verifyPayment = asyncHandler(async (req, res) => {
    const userId = req.user?.id || req.body.userId || 1;
    const result = await paymentService.verifyPayment(userId, req.body);

    return res.status(200).json({
        success: true,
        message: result.message,
        data: result.subscription,
    });
});

const getPaymentHistory = asyncHandler(async (req, res) => {
    const userId = req.user?.id || req.query.userId || 1;
    const history = await paymentService.getPaymentHistory(userId);

    return res.status(200).json({
        success: true,
        data: history,
    });
});

module.exports = {
    getSubscriptionStatus,
    createOrder,
    verifyPayment,
    getPaymentHistory,
};
