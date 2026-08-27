require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DB_URL,
});
console.log(process.env.DB_URL);
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
