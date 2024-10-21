require("dotenv").config();
const { Pool } = require("pg");

console.log("Starting database connection...");
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432, // default port is 5432
  ssl: {
    rejectUnauthorized: false, // for local development only
  },
});

// 連接成功時的回調
pool.on("connect", () => {
  console.log("Connected to the PostgreSQL database");
});

// 錯誤處理
pool.on("error", (err) => {
  console.log("Fail to Connected to the PostgreSQL database ......clea");
  console.error("Error connecting to the PostgreSQL database", err);
  process.exit(-1);
});

// 導出連接池，供其他模組使用
module.exports = {
  query: (text, params) => pool.query(text, params),
};
