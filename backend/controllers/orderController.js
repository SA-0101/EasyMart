const pool = require("../db/db");

const placeOrder = async (req, res, next) => {
  const {
    name,
    contact,
    address,
    payment_method,
    total_amount,
    delivery_charges,
  } = req.body;
  const result = await pool.query(
    "INSERT INTO orders (user_id,name,contact,address,payment_method,total_amount,delivery_charges) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *",
    [
      req.user.id,
      name,
      contact,
      address,
      payment_method,
      total_amount,
      delivery_charges,
    ],
  );
  console.log("this is result of order table ", result.rows);
  const result2 = await pool.query(
    `INSERT INTO order_items (order_id,product_id,name,description,image,price,quantity) 
    SELECT $1,product_id,name,description,image,price,quantity
    FROM cart
    WHERE user_id=$2
    RETURNING *`,
    [result.rows[0].id, req.user.id],
  );
  console.log("this is result from cart to cart items ", result2.rows);
  res.send("order placed");
};

const retrieveOrders = async (req, res, next) => {
  const result = await pool.query(
    `SELECT orders.id,orders.name,orders.contact,orders.address,order_items.name,order_items.price,order_items.quantity
    FROM orders
    INNER JOIN order_items
    ON orders.id=order_items.order_id
    WHERE user_id=$1`,
    [req.user.id],
  );
  res.send(result.rows);
};
const cancelOrder = async (req, res, next) => {
  const id = req.params.id;
  const result = pool.query(
    "UPDATE orders SET user_id=COALESCE($1,user_id), name=COALESCE($2,name),contact=COALESCE($3,contact),address=COALESCE($4,address),payment_method=COALESCE($5,payment_method),total_amount=COALESCE($6,total_amount),delivery_charges=COALESCE($7,delivery_charges), status=$8 WHERE id=$9 AND user_id=$10 RETURNING *",
    [null, null, null, null, null, null, null, "cancel", id, req.user.id],
  );
  res.send("status changed");
};

module.exports = { placeOrder, retrieveOrders, cancelOrder };
