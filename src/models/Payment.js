const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Payment = sequelize.define(
    "Payment",
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
        },
        razorpay_order_id: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        razorpay_payment_id: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        razorpay_signature: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 5.0,
        },
        currency: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: "INR",
        },
        status: {
            type: DataTypes.STRING(30),
            allowNull: false,
            defaultValue: "created", // created, captured, failed
        },
        plan: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: "monthly_rs_5",
        },
        billing_cycle_days: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 30,
        },
    },
    {
        tableName: "payments",
        timestamps: true,
        underscored: true,
    }
);

module.exports = Payment;
