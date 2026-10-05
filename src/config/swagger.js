const swaggerJSDoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "RecallFlow API Documentation",
            version: "1.0.0",
            description: "RESTful API for Spaced Repetition Study & Revision Management Platform",
            contact: {
                name: "RecallFlow Engineering",
            },
        },
        servers: [
            {
                url: "http://localhost:3000/api/v1",
                description: "Development server",
            },
        ],
        tags: [
            { name: "Courses", description: "Course management operations" },
            { name: "Topics", description: "Topic management operations" },
            { name: "Study Entries", description: "Study session logging operations" },
            { name: "Revisions", description: "Spaced repetition revision management" },
            { name: "Dashboard", description: "Daily study and revision overview metrics" },
            { name: "Analytics", description: "Overview, weekly, and monthly analytics" },
            { name: "Calendar", description: "Monthly study & revision grid" },
            { name: "Search", description: "Global keyword search" },
            { name: "Notifications", description: "Daily revision reminders & alert notifications" },
            { name: "Payments", description: "Razorpay subscriptions and paywall management" },
        ],
    },
    apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
