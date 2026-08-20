const express = require("express");
const {
  placeOrder,
  retrieveOrders,
} = require("../controllers/orderController");
const token_auth = require("../middlewares/token-auth");
const router = express.Router();

router.post("/", token_auth, placeOrder);
router.get("/", retrieveOrders);

module.exports = router;
