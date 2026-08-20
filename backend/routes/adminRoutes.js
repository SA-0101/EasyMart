const express = require("express");
const router = express.Router();
const {
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/adminController");
const access_middleware = require("../middlewares/access-middleware");
const token_auth = require("../middlewares/token-auth");

router.post("/", token_auth, access_middleware("admin"), createProduct);
router.patch("/:id", token_auth, access_middleware("admin"), updateProduct);
router.delete("/:id", token_auth, access_middleware("admin"), deleteProduct);

module.exports = router;
