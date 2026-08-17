const express = require("express");
const {
  getProductById,
  getProductsByName,
} = require("../controllers/productController");
const { getProducts } = require("../controllers/adminController");
const router = express.Router();

router.get("/", getProducts);
router.get("/details/:id", getProductById);
router.get("/products/filter", getProductsByName);

module.exports = router;
