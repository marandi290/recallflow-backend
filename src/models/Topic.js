const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Topic = sequelize.define(
    "Topic",
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        course_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        tableName: "topics",
        timestamps: true,
        underscored: true,

        indexes: [
            {
                name: "uk_course_topic",
                unique: true,
                fields: ["course_id", "title"],
            },
        ],
    }
);

module.exports = Topic;