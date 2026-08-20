const pool = require("./../db/db");

const addProduct = async (req, res, next) => {
  try {
    const { product_id, name, description, image, price, quantity } = req.body;
    console.log(product_id, name, description, image, price, quantity);

    const result = await pool.query(
      "INSERT INTO cart (user_id,product_id,name,description,image,price,quantity) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *",
      [req.user.id, product_id, name, description, image, price, quantity],
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
    const result = await pool.query("SELECT * FROM cart WHERE user_id=$1", [
      id,
    ]);
    if (result.rows.length == 0) {
      err = {
        status: 404,
        message: "no products found,add products to cart",
      };
      return next(err);
    }
    res.status(200).json(result.rows);
  } catch (err) {
    return next(err);
  }
};
const updateQuantity = async (req, res) => {
  res.send("update quantity");
};
const removeProduct = async (req, res, next) => {
  //ISSUE IS THAT EVEN IF THE PRODUCT IS NOT IN THE CART STILL THE QUERY RUNS AND RETURNED EMPTY ARRAY
  try {
    const id = req.params.id;
    if (!id) {
      err = {
        status: 404,
        message: "no such product to remove",
      };
    }
    const user_id = req.user.id;
    const result = await pool.query(
      "DELETE FROM cart WHERE id=$1 AND user_id=$2 RETURNING *",
      [id, user_id],
    );
    res.send(result.rows);
  } catch (err) {
    return next(err);
  }
};
const clearCart = async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM cart WHERE user_id=$1 RETURNING *",
      [req.user.id],
    );
    res.send(result.rows);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  addProduct,
  viewCart,
  updateQuantity,
  removeProduct,
  clearCart,
};
