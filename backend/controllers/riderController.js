const pool = require("../db/db");

const getOrders = async (req, res, next) => {
  const result = await pool.query("SELECT * FROM orders WHERE rider_id=$1", [
    req.user.id,
  ]);
  res.send(result.rows);
};

const updateStatus = async (req, res, next) => {
  const { id, status } = req.body;
  const allowedStatus = ["packed", "shipped", "out for delivery", "delivered"];

  if (!allowedStatus.includes(status)) {
    err = {
      status: 400,
      message: "invalid status input",
    };
    return next(err);
  }
  const result = await pool.query(
    "UPDATE orders SET status=$1 WHERE id=$2 AND rider_id=$3 RETURNING *",
    [status, id, req.user.id],
  );
  if (result.rows.length == 0) {
    err = {
      status: 404,
      message: "order not found",
    };
    return next(err);
  }
  res.send(result.rows);
};

module.exports = { getOrders, updateStatus };
