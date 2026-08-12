const pool = require("../db/db");
const createProduct = async (req, res) => {
  const { name, description, image, price } = req.body;
  console.log(name, description, image, price);

  const result = await pool.query(
    "INSERT INTO products (name,description,image,price) VALUES($1,$2,$3,$4) RETURNING *",
    [name, description, image, price],
  );
  res.json(result.rows[0]);
};

const getProducts = async (req, res) => {
  const result = await pool.query("SELECT * FROM products");
  res.json(result.rows);
};

const updateProduct = async (req, res) => {
  const id = req.params.id;
  const { name, description, image, price } = req.body;
  console.log(name, description, image, price, id);
  const result = await pool.query(
    "UPDATE products SET name=COALESCE($1,name),description=COALESCE($2,description),image=COALESCE($3,image),price=COALESCE($4,price) WHERE id=$5 RETURNING *",
    [name, description, image, price, id],
  );
  res.json(result.rows[0]);
};

const deleteProduct = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const result = await pool.query(
    "DELETE FROM products WHERE id=$1 RETURNING *",
    [id],
  );
  res.json(result.rows[0]);
};

module.exports = { createProduct, getProducts, updateProduct, deleteProduct };
