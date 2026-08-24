const express = require("express");
const token_auth = require("../middlewares/token-auth");
const {
  viewCart,
  addProduct,
  removeProduct,
  clearCart,
} = require("../controllers/cartController");
const router = express.Router();

router.get("/products", viewCart);
router.post("/products", addProduct);
router.delete("/products/:id", removeProduct);
router.delete("/products", clearCart);

module.exports = router;
