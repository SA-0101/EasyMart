require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
});
const DB_CONNECTION = async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("DB connected successfully", result.rows[0]);
  } catch (err) {
    console.log("error in DB connection ", err.message);
  }
};

DB_CONNECTION();
module.exports = pool;
