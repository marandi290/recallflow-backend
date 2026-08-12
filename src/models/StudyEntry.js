const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const StudyEntry = sequelize.define(
    "StudyEntry",
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        topic_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
        },
        study_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        duration_minutes: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        difficulty: {
            type: DataTypes.ENUM("easy", "medium", "hard"),
            allowNull: false,
        },
        study_notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        tableName: "study_entries",
        timestamps: true,
        underscored: true,
        indexes: [
            {
                name: "idx_study_date",
                fields: ["study_date"],
            },
            {
                name: "idx_topic_study_date",
                fields: ["topic_id", "study_date"],
            },
        ],
    }
);

module.exports = StudyEntry;