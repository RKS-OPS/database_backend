require("dotenv").config();
const { Pool } = require("pg");

console.log("Starting database connection...");
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432, // default port is 5432
  ssl: false,
});

// callback - called when a new client connects
pool.on("connect", async (client) => {
  console.log("Connected to the PostgreSQL database");
  try {
    await client.query(`SET search_path TO "JVN_DB_SYSTEM";`);
    console.log('Schema search_path set to "JVN_DB_SYSTEM"');
  } catch (error) {
    console.error("Failed to set search_path:", error);
  }
});

// error handler
pool.on("error", (err) => {
  console.log("Fail to Connected to the PostgreSQL database ......clea");
  console.error("Error connecting to the PostgreSQL database", err);
  process.exit(-1);
});

// export the query method for passing queries to the pool
module.exports = {
  // export the pool object for transactions purposes
  pool,
  query: (text, params) => pool.query(text, params),
};
