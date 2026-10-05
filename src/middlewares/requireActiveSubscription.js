const { User } = require("../models");
const ApiError = require("../utils/ApiError");
const httpStatus = require("../constants/httpStatus");

/**
 * Middleware to enforce the Rs. 5/month paywall after the 7-day free trial.
 */
const requireActiveSubscription = async (req, res, next) => {
    try {
        const userId = req.user?.id || req.body?.user_id || req.body?.userId || req.query?.userId || 1;

        const user = await User.findByPk(userId);
        if (!user) {
            return next();
        }

        const now = new Date();
        const createdAt = new Date(user.createdAt || now);

        const trialEndsAt = user.trial_ends_at
            ? new Date(user.trial_ends_at)
            : new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000);

        const isSubscriptionActive =
            user.subscription_status === "active" &&
            user.subscription_ends_at &&
            new Date(user.subscription_ends_at).getTime() > now.getTime();

        const isTrialActive = trialEndsAt.getTime() > now.getTime();

        if (!isSubscriptionActive && !isTrialActive) {
            throw new ApiError(
                httpStatus.PAYMENT_REQUIRED,
                "Your 7-day free trial has expired. An active subscription of Rs. 5/month is required to continue."
            );
        }

        next();
    } catch (err) {
        next(err);
    }
};

module.exports = requireActiveSubscription;
