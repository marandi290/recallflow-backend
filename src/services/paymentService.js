const Razorpay = require("razorpay");
const crypto = require("crypto");
const { User, Payment } = require("../models");
const ApiError = require("../utils/ApiError");
const httpStatus = require("../constants/httpStatus");

const getRazorpayInstance = () => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret || keyId === "your_razorpay_key_id" || keyId.trim() === "") {
        return null;
    }

    return new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
    });
};

const computeSubscriptionStatus = (user) => {
    const now = new Date();
    const createdAt = new Date(user.createdAt || now);

    // 7-day free trial from registration or explicit trial_ends_at
    const trialEndsAt = user.trial_ends_at
        ? new Date(user.trial_ends_at)
        : new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000);

    const subscriptionEndsAt = user.subscription_ends_at
        ? new Date(user.subscription_ends_at)
        : null;

    const isSubscriptionActive =
        user.subscription_status === "active" &&
        subscriptionEndsAt !== null &&
        subscriptionEndsAt.getTime() > now.getTime();

    const isTrialActive = trialEndsAt.getTime() > now.getTime();

    const hasAccess = isSubscriptionActive || isTrialActive;

    const daysRemainingInTrial = isTrialActive
        ? Math.max(0, Math.ceil((trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
        : 0;

    const daysRemainingInSubscription = isSubscriptionActive
        ? Math.max(0, Math.ceil((subscriptionEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
        : 0;

    let plan = "expired";
    if (isSubscriptionActive) {
        plan = "active";
    } else if (isTrialActive) {
        plan = "trial";
    }

    return {
        hasAccess,
        plan, // "trial" | "active" | "expired"
        isTrialActive,
        isSubscriptionActive,
        trialEndsAt: trialEndsAt.toISOString(),
        subscriptionEndsAt: subscriptionEndsAt ? subscriptionEndsAt.toISOString() : null,
        daysRemainingInTrial,
        daysRemainingInSubscription,
        amount: 5,
        currency: "INR",
        billingCycle: "monthly",
    };
};

const getSubscriptionStatus = async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    return computeSubscriptionStatus(user);
};

const createOrder = async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    const amountInPaise = 500; // Rs. 5 = 500 paise
    const currency = "INR";
    const receipt = `rcpt_${userId}_${Date.now()}`;
    const rzp = getRazorpayInstance();

    let orderId;
    let isSandbox = false;

    if (rzp) {
        try {
            const rzpOrder = await rzp.orders.create({
                amount: amountInPaise,
                currency,
                receipt,
                notes: {
                    userId: String(userId),
                    plan: "monthly_rs_5",
                    userName: user.name,
                    userEmail: user.email,
                },
            });
            orderId = rzpOrder.id;
        } catch (err) {
            console.error("Razorpay order creation error:", err);
            throw new ApiError(httpStatus.BAD_GATEWAY, `Failed to create Razorpay order: ${err.message}`);
        }
    } else {
        // Fallback test order when Razorpay keys are not yet provided
        orderId = `order_test_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
        isSandbox = true;
    }

    // Save initial payment intent
    await Payment.create({
        user_id: userId,
        razorpay_order_id: orderId,
        amount: 5.0,
        currency,
        status: "created",
        plan: "monthly_rs_5",
        billing_cycle_days: 30,
    });

    return {
        orderId,
        amount: amountInPaise,
        currency,
        keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
        isSandbox,
        user: {
            name: user.name,
            email: user.email,
        },
    };
};

const verifyPayment = async (userId, paymentData) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;

    if (!razorpay_order_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Missing razorpay_order_id in verification payload");
    }

    const user = await User.findByPk(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    const payment = await Payment.findOne({
        where: { razorpay_order_id, user_id: userId },
    });

    if (!payment) {
        throw new ApiError(httpStatus.NOT_FOUND, "Payment order record not found");
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (keySecret && keySecret !== "your_razorpay_key_secret" && keySecret.trim() !== "") {
        // Cryptographic HMAC SHA-256 verification
        const hmac = crypto.createHmac("sha256", keySecret);
        hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const generatedSignature = hmac.digest("hex");

        if (generatedSignature !== razorpay_signature) {
            payment.status = "failed";
            await payment.save();
            throw new ApiError(httpStatus.BAD_REQUEST, "Payment verification failed: Invalid signature");
        }
    }

    // Mark payment as captured
    payment.razorpay_payment_id = razorpay_payment_id || `pay_sim_${Date.now()}`;
    payment.razorpay_signature = razorpay_signature || "simulated_signature";
    payment.status = "captured";
    await payment.save();

    // Extend or activate user subscription by 30 days
    const now = new Date();
    const currentEnd = user.subscription_ends_at ? new Date(user.subscription_ends_at) : null;
    const baseTime = currentEnd && currentEnd.getTime() > now.getTime() ? currentEnd : now;
    const newSubscriptionEndsAt = new Date(baseTime.getTime() + 30 * 24 * 60 * 60 * 1000);

    user.subscription_status = "active";
    user.subscription_ends_at = newSubscriptionEndsAt;
    await user.save();

    return {
        success: true,
        message: "Payment verified successfully. Subscription active for 30 days.",
        subscription: computeSubscriptionStatus(user),
    };
};

const getPaymentHistory = async (userId) => {
    const payments = await Payment.findAll({
        where: { user_id: userId },
        order: [["created_at", "DESC"]],
    });
    return payments;
};

module.exports = {
    computeSubscriptionStatus,
    getSubscriptionStatus,
    createOrder,
    verifyPayment,
    getPaymentHistory,
};
