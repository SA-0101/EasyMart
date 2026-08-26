const pool = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getUsers = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT id,username,email,role FROM users");
    if (result.rows.length == 0) {
      err = {
        status: 404,
        message: "No user found,register first",
      };
      return next(err);
    }
    res.status(200).json(result.rows);
  } catch (err) {
    return next(err);
  }
};

module.exports = { getUsers };
