const pool = require("../db/db");
const bcrypt = require("bcrypt");

const createProduct = async (req, res, next) => {
  try {
    const { name, description, image, price } = req.body;
    console.log(name, description, image, price);

    const result = await pool.query(
      "INSERT INTO products (name,description,image,price) VALUES($1,$2,$3,$4) RETURNING *",
      [name, description, image, price],
    );
    res.json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (err) {
    return next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { name, description, image, price } = req.body;
    console.log(name, description, image, price, id);
    const result = await pool.query(
      "UPDATE products SET name=COALESCE($1,name),description=COALESCE($2,description),image=COALESCE($3,image),price=COALESCE($4,price) WHERE id=$5 RETURNING *",
      [name, description, image, price, id],
    );
    res.json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log(id);
    const result = await pool.query(
      "DELETE FROM products WHERE id=$1 RETURNING *",
      [id],
    );
    res.json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
};

const registerAdmin = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password || !role) {
      const err = {
        status: 400,
        message: "all fields required",
      };
      return next(err);
    }

    if (role !== "admin") {
      const err = {
        status: 401,
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
        status: 200,
        message: "already registered",
      };
      return next(err);
    }
    const hash_pass = await bcrypt.hash(password, 10);

    const user = await pool.query(
      "INSERT INTO users (username,email,password,role) VALUES($1,$2,$3,$4) RETURNING *",
      [username, email, hash_pass, role],
    );
    res.send(user.rows[0]);
  } catch (err) {
    err.message = "error in admin registration";
    return next(err);
  }
};

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  registerAdmin,
};
