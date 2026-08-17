const pool = require("./../db/db");

const addProduct = async (req, res) => {
  const id = req.params.id;
  const result = await pool.query(
    "INSERT INTO cart (product_id,user_id) VALUES($1,$2) RETURNING *",
    [id, req.user.id],
  );
  res.send(result.rows);
};
const viewCart = async (req, res) => {
  const id = req.user.id;
  const result = await pool.query("SELECT * FROM cart WHERE user_id=$1", [id]);
  res.send(result.rows);
};
const updateQuantity = (req, res) => {
  res.send("update quantity");
};
const removeProduct = (req, res) => {
  res.send("remove product");
};
const clearCart = (req, res) => {
  res.send("clear cart");
};

module.exports = {
  addProduct,
  viewCart,
  updateQuantity,
  removeProduct,
  clearCart,
};
