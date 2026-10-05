const { Sequelize } = require("sequelize");
require("dotenv").config();

const dbUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;

const dialectOptions = {};
if (process.env.DB_SSL === "true" || process.env.MYSQL_SSL === "true") {
    dialectOptions.ssl = {
        require: true,
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
          process.env.DB_NAME,
          process.env.DB_USER,
          process.env.DB_PASSWORD || process.env.DB_PASS,
          {
              host: process.env.DB_HOST,
              port: process.env.DB_PORT || 3306,
              dialect: "mysql",
              dialectOptions,
              logging: false,
          }
      );

module.exports = sequelize;