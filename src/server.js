const app = require("./app");
const { sequelize, Payment } = require("./models");

const PORT = process.env.PORT || 3000;
let server;

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log("✅ Database connected successfully.");

        // Create Payment table if it does not exist
        try {
            await Payment.sync();
        } catch (tableErr) {
            console.warn("Notice: Payment table sync:", tableErr.message);
        }

        // Safe column additions for TiDB / MySQL production compatibility
        const safeAddColumn = async (columnDef) => {
            try {
                await sequelize.query(`ALTER TABLE users ADD COLUMN ${columnDef}`);
            } catch (colErr) {
                // Ignore if column already exists (MySQL errno 1060)
            }
        };

        await safeAddColumn("subscription_status VARCHAR(20) DEFAULT 'trial'");
        await safeAddColumn("trial_ends_at DATETIME DEFAULT NULL");
        await safeAddColumn("subscription_ends_at DATETIME DEFAULT NULL");

        console.log("✅ Models and tables ready.");

        server = app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Database connection failed.");
        console.error(error);
        process.exit(1);
    }
}

const gracefulShutdown = (signal) => {
    console.log(`\n⚠️ Received ${signal}. Starting graceful shutdown...`);
    if (server) {
        server.close(async () => {
            console.log("HTTP server closed.");
            try {
                await sequelize.close();
                console.log("Database connection closed.");
                process.exit(0);
            } catch (err) {
                console.error("Error closing database connection:", err);
                process.exit(1);
            }
        });
    } else {
        process.exit(0);
    }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

startServer();