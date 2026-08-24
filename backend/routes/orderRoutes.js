const express = require("express");
const {
  placeOrder,
  cancelOrder,
  getOrders,
} = require("../controllers/orderController");
const token_auth = require("../middlewares/token-auth");
const router = express.Router();

router.post("/", placeOrder);
router.get("/", getOrders);
router.patch("/:id", cancelOrder);

module.exports = router;
