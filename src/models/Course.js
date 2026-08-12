const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Course = sequelize.define(
    "Course",
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING(50),
        },
        goal: {
            type: DataTypes.STRING(255),
        },
        duration_days: {
            type: DataTypes.INTEGER,
        },
        algorithm: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        start_date: {
            type: DataTypes.DATEONLY,
        },
        status: {
            type: DataTypes.ENUM("active", "completed", "archived"),
            defaultValue: "active",
        },
    },
    {
        tableName: "courses",
        timestamps: true,
        underscored: true,
        indexes: [
            {
                name: "uk_user_course",
                unique: true,
                fields: ["user_id", "title"],
            },
        ],
    }
);

module.exports = Course;