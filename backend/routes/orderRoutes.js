const express = require("express");
const {
  placeOrder,
  retrieveOrders,
  cancelOrder,
} = require("../controllers/orderController");
const token_auth = require("../middlewares/token-auth");
const router = express.Router();

router.post("/", token_auth, placeOrder);
router.get("/", token_auth, retrieveOrders);
router.patch("/:id", token_auth, cancelOrder);

module.exports = router;
