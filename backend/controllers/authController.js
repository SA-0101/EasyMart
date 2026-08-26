const pool = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const REFRESH_SECRET = process.env.REFRESH_SECRET;
const ACCESS_SECRET = process.env.ACCESS_SECRET;
const registerUser = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password || !role) {
      const err = {
        status: 400,
        message: "all fields required",
      };
      return next(err);
    }

    if (role !== "customer" && role !== "rider") {
      const err = {
        status: 400,
        message: "Invalid role",
      };
      return next(err);
    }
    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1 AND role=$2",
      [email, role],
    );
    if (result.rows.length != 0) {
      const err = {
        status: 209,
        message: "already registered",
      };
      return next(err);
    }
    const hash_pass = await bcrypt.hash(password, 10);
    const user = await pool.query(
      "INSERT INTO users (username,email,password,role) VALUES($1,$2,$3,$4) RETURNING *",
      [username, email, hash_pass, role],
    );
    res.status(200).json(user.rows[0]);
  } catch (err) {
    return next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      const err = {
        status: 400,
        message: "all fields required",
      };
      return next(err);
    }
    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1 and role=$2",
      [email, role],
    );
    if (result.rows.length == 0) {
      const err = {
        status: 400,
        message: "Invalid email or password",
      };
      return next(err);
    }
    const verify_pass = await bcrypt.compare(password, result.rows[0].password);
    if (!verify_pass) {
      const err = {
        status: 400,
        message: "Invalid email or password",
      };
      return next(err);
    }

    const access_token = jwt.sign(
      {
        id: result.rows[0].id,
        email: result.rows[0].email,
        role: result.rows[0].role,
      },
      ACCESS_SECRET,
      {
        expiresIn: "60m",
      },
    );

    const refresh_token = jwt.sign(
      {
        id: result.rows[0].id,
        email: result.rows[0].email,
        role: result.rows[0].role,
      },
      REFRESH_SECRET,
      {
        expiresIn: "20d",
      },
    );

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: false,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    const result2 = await pool.query(
      "UPDATE users SET refresh_token=$1 WHERE id=$2 RETURNING *",
      [refresh_token, result.rows[0].id],
    );
    res.status(200).json({ access_token });
  } catch (err) {
    return next(err);
  }
};

const refresh_token = async (req, res, next) => {
  try {
    const refresh_token = req.cookies.refresh_token;
    const result = await pool.query(
      "SELECT * FROM users WHERE refresh_token=$1",
      [refresh_token],
    );
    if (result.rows.length == 0) {
      const err = {
        status: 400,
        message: "provide valid token",
      };
      return next(err);
    }

    const new_access_token = jwt.sign(
      {
        id: result.rows[0].id,
        email: result.rows[0].email,
        role: result.rows[0].role,
      },
      ACCESS_SECRET,
      {
        expiresIn: "60m",
      },
    );

    const new_refresh_token = jwt.sign(
      {
        id: result.rows[0].id,
        email: result.rows[0].email,
        role: result.rows[0].role,
      },
      REFRESH_SECRET,
      {
        expiresIn: "20d",
      },
    );

    res.cookie("refresh_token", new_refresh_token, {
      httpOnly: true,
      secure: false,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    const result2 = await pool.query(
      "UPDATE users SET refresh_token=$1 WHERE id=$2",
      [new_refresh_token, result.rows[0].id],
    );
    res.status(200).json({ access_token: new_access_token });
  } catch (err) {
    return next(err);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    const refresh_token = req.cookies.refresh_token;
    const result = await pool.query(
      "SELECT * FROM users WHERE refresh_token=$1",
      [refresh_token],
    );
    if (result.rows.length == 0) {
      const err = {
        status: 400,
        message: "provide valid token",
      };
      return next(err);
    }
    const result2 = await pool.query(
      "UPDATE users SET refresh_token=$1 WHERE id=$2",
      [null, result.rows[0].id],
    );

    res.clearCookie("refresh_token");
    res.status(200).json({ message: "Logout successfully" });
  } catch (err) {
    message = `error in logout ${err}`;
    return next(err);
  }
};

module.exports = { registerUser, loginUser, refresh_token, logoutUser };
