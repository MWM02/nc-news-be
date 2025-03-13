const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({ path: `${__dirname}/../.env.${ENV}` });

let db = new Pool();

const config = {};

if (ENV === "production") {
  config.connectionString = process.env.PGDATABASE_URL;
  config.max = 2;
}

if (!process.env.PGDATABASE && !process.env.PGDATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not configured");
} else {
  console.log(`Connected to ${process.env.PGDATABASE}`);
}

db = new Pool(config);

module.exports = db;
