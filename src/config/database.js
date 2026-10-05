const { Sequelize } = require("sequelize");
require("dotenv").config();

const dbUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;

const isTiDB =
    (process.env.DB_HOST && process.env.DB_HOST.includes("tidbcloud")) ||
    (dbUrl && dbUrl.includes("tidbcloud"));

const useSSL =
    process.env.DB_SSL === "true" ||
    process.env.MYSQL_SSL === "true" ||
    isTiDB;

const dialectOptions = {};
if (useSSL) {
    dialectOptions.ssl = {
        minVersion: "TLSv1.2",
        rejectUnauthorized: false,
    };
}

const sequelize = dbUrl
    ? new Sequelize(dbUrl, {
          dialect: "mysql",
          dialectOptions,
          logging: false,
      })
    : new Sequelize(
          process.env.DB_NAME || "test",
          process.env.DB_USER,
          process.env.DB_PASSWORD || process.env.DB_PASS,
          {
              host: process.env.DB_HOST,
              port: Number(process.env.DB_PORT) || 4000,
              dialect: "mysql",
              dialectOptions,
              logging: false,
          }
      );

module.exports = sequelize;