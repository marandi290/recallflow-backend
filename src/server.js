const app = require("./app");
const { sequelize } = require("./models");

const PORT = process.env.PORT || 3000;
let server;

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log("✅ Database connected successfully.");

        await sequelize.sync();
        console.log("✅ Models synchronized.");

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