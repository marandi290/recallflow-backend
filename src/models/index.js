const sequelize = require("../config/database");
const User = require("./User");
const Course = require("./Course");
const Topic = require("./Topic");
const StudyEntry = require("./StudyEntry");
const Revision = require("./Revision");
const Payment = require("./Payment");

// Associations
User.hasMany(Course, {
    foreignKey: "user_id",
    as: "courses",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

Course.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

// User -> Payment
User.hasMany(Payment, {
    foreignKey: "user_id",
    as: "payments",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

Payment.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

// Course -> Topic
Course.hasMany(Topic, {
    foreignKey: "course_id",
    as: "topics",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

Topic.belongsTo(Course, {
    foreignKey: "course_id",
    as: "course",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

// Topic -> StudyEntry
Topic.hasMany(StudyEntry, {
    foreignKey: "topic_id",
    as: "studyEntries",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

StudyEntry.belongsTo(Topic, {
    foreignKey: "topic_id",
    as: "topic",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

// StudyEntry -> Revision
StudyEntry.hasMany(Revision, {
    foreignKey: "study_entry_id",
    as: "revisions",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

Revision.belongsTo(StudyEntry, {
    foreignKey: "study_entry_id",
    as: "studyEntry",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

module.exports = {
    sequelize,
    User,
    Course,
    Topic,
    StudyEntry,
    Revision,
    Payment,
};