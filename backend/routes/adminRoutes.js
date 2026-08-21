const express = require("express");
const router = express.Router();
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  getRiders,
} = require("../controllers/adminController");
const access_middleware = require("../middlewares/access-middleware");
const token_auth = require("../middlewares/token-auth");

router.post("/products", token_auth, access_middleware("admin"), createProduct);
router.patch(
  "/products/:id",
  token_auth,
  access_middleware("admin"),
  updateProduct,
);
router.delete(
  "/products/:id",
  token_auth,
  access_middleware("admin"),
  deleteProduct,
);

router.get("/orders", token_auth, access_middleware("admin"), getOrders);
router.get("/riders", token_auth, access_middleware("admin"), getRiders);

module.exports = router;
