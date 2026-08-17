const pool = require("./../db/db");

const addProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      err = {
        status: 404,
        message: "provide id",
      };
    }
    const result = await pool.query(
      "INSERT INTO cart (product_id,user_id) VALUES($1,$2) RETURNING *",
      [id, req.user.id],
    );
    res.send(result.rows);
  } catch (err) {
    return next(err);
  }
};
const viewCart = async (req, res, next) => {
  try {
    const id = req.user.id;
    if (!id) {
      return next(err);
    }

    const result = await pool.query(
      "SELECT products.name,products.description,products.image,products.price FROM products INNER JOIN cart ON products.id=cart.product_id WHERE user_id=$1",
      [id],
    );
    if (result.rows.length == 0) {
      err = {
        status: 404,
        message: "no products found,add products to cart",
      };
      return next(err);
    }
    res.send(result.rows);
  } catch (err) {
    return next(err);
  }
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
