const pool = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getUsers = async (req, res) => {
  const result = await pool.query("SELECT * FROM users");
  res.status(200).json(result.rows);
};

module.exports = { getUsers };
