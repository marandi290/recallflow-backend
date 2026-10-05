const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const paymentController = require("../controllers/paymentController");

const JWT_SECRET = process.env.JWT_SECRET || "recallflow_secret_key_2026";

const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
        } catch (e) {
            // Optional auth continues even if token expired
        }
    }
    next();
};

/**
 * @swagger
 * /payments/status:
 *   get:
 *     summary: Get current user subscription and trial status
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Subscription status details
 */
router.get("/status", optionalAuth, paymentController.getSubscriptionStatus);

/**
 * @swagger
 * /payments/create-order:
 *   post:
 *     summary: Create Razorpay order for Rs. 5 monthly subscription
 *     tags: [Payments]
 *     responses:
 *       201:
 *         description: Razorpay order created
 */
router.post("/create-order", optionalAuth, paymentController.createOrder);

/**
 * @swagger
 * /payments/verify:
 *   post:
 *     summary: Verify Razorpay payment signature and activate subscription
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Payment verified and subscription activated
 */
router.post("/verify", optionalAuth, paymentController.verifyPayment);
router.post("/verify-payment", optionalAuth, paymentController.verifyPayment);

/**
 * @swagger
 * /payments/history:
 *   get:
 *     summary: Get user payment transaction history
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: List of payment transactions
 */
router.get("/history", optionalAuth, paymentController.getPaymentHistory);

module.exports = router;
