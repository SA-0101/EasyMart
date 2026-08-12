const pool = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const REFRESH_SECRET = process.env.REFRESH_SECRET;
const ACCESS_SECRET = process.env.ACCESS_SECRET;
const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password || !role) {
      res.status(401).json({ err: "all fields required" });
    }

    if (role !== "customer" && role !== "rider") {
      return res.status(401).json({ message: "Invalid role" });
    }
    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1 AND role=$2",
      [email, role],
    );
    if (result.rows.length != 0) {
      return res.status(200).json({ message: "already registered" });
    }
    const hash_pass = await bcrypt.hash(password, 10);
    const user = await pool.query(
      "INSERT INTO users (username,email,password,role) VALUES($1,$2,$3,$4) RETURNING *",
      [username, email, hash_pass, role],
    );
    res.send(user.rows[0]);
  } catch (err) {
    res.send(err);
  }
};

const loginUser = async (req, res) => {
  //   try {
  const { email, password, role } = req.body;
  console.log(email, password);
  if (!email || !password) {
    return res.status(401).json({ err: "all fields are required" });
  }
  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1 and role=$2",
    [email, role],
  );
  if (result.rows.length == 0) {
    return res.status(401).json({ err: "Invalid email or password" });
  }
  const verify_pass = await bcrypt.compare(password, result.rows[0].password);
  if (!verify_pass) {
    return res.status(401).json({ err: "Invalid email or password" });
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
  res.send({ access_token });
  //   }
  //   catch (err) {
  //     res.send(err);
  //   }
};

const refresh_token = async (req, res) => {
  try {
    const refresh_token = req.cookies.refresh_token;
    const result = await pool.query(
      "SELECT * FROM users WHERE refresh_token=$1",
      [refresh_token],
    );
    if (result.rows.length == 0) {
      return res.json({ message: "provide valid refresh" });
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
    res.send({ access_token: new_access_token });
  } catch (err) {
    res.json({ err: err });
  }
};

const logoutUser = async (req, res) => {
  try {
    const refresh_token = req.cookies.refresh_token;
    const result = await pool.query(
      "SELECT * FROM users WHERE refresh_token=$1",
      [refresh_token],
    );
    if (result.rows.length == 0) {
      return res.json({ message: "provide valid refresh" });
    }
    const result2 = await pool.query(
      "UPDATE users SET refresh_token=$1 WHERE id=$2",
      [null, result.rows[0].id],
    );

    res.clearCookie("refresh_token");
    res.status(200).json({ message: "Logout successfully" });
  } catch (err) {
    res.json({ err: `error in logout ${err}` });
  }
};

module.exports = { registerUser, loginUser, refresh_token, logoutUser };
