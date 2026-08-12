const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Revision = sequelize.define(
    "Revision",
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        study_entry_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
        },
        revision_number:{
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        revision_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        algorithm: {
            type: DataTypes.ENUM("quick","three_month","six_month","one_year","two_year","custom"),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("pending", "completed", "missed"),
            allowNull: false,
            defaultValue: "pending",
        },
        completed_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        revision_notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        tableName: "revisions",
        timestamps: true,
        underscored: true,
        indexes: [
            {
                name: "idx_revision_date",
                fields: ["revision_date"],
            },
            {
                name: "idx_status",
                fields: ["status"],
            },
            {
                name: "idx_study_entry",
                fields: ["study_entry_id"],
            },
            {
                name: "uk_study_entry_revision",
                unique: true,
                fields: [
                    "study_entry_id",
                    "revision_number",
                ],
            },
        ]
    }
);

console.log("Revision model loaded");

module.exports = Revision;