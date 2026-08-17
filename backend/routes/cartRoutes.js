const express = require("express");
const token_auth = require("../middlewares/token-auth");
const {
  viewCart,
  addProduct,
  removeProduct,
  clearCart,
} = require("../controllers/cartController");
const router = express.Router();

router.get("/products", token_auth, viewCart);
router.post("/product/:id", token_auth, addProduct);
router.delete("/product/:id", token_auth, removeProduct);
router.delete("/products", token_auth, clearCart);

module.exports = router;
