const express = require("express");
const {
  placeOrder,
  retrieveOrders,
} = require("../controllers/orderController");
const router = express.Router();

router.post("/", placeOrder);
router.get("/", retrieveOrders);

module.exports = router;
