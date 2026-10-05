const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const requestLogger = require("./middlewares/requestLogger");
const apiLimiter = require("./middlewares/rateLimiter");

const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const topicRoutes = require("./routes/topicRoutes");
const studyEntryRoutes = require("./routes/studyEntryRoutes");
const revisionRoutes = require("./routes/revisionRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const calendarRoutes = require("./routes/calendarRoutes");
const searchRoutes = require("./routes/searchRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const aiRoutes = require("./routes/aiRoutes");
const dataRoutes = require("./routes/dataRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Security Middlewares
app.use(helmet({
    contentSecurityPolicy: false, // Allows Swagger UI inline scripts
}));
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use("/api", apiLimiter);

// Swagger Documentation Endpoints
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root Welcome & Health Check
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "RecallFlow Backend API is online",
        docs: "/api-docs",
        version: "1.0.0",
    });
});

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/topics", topicRoutes);
app.use("/api/v1/study-entries", studyEntryRoutes);
app.use("/api/v1/revisions", revisionRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/calendar", calendarRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/data", dataRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api", paymentRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
