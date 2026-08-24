const express = require("express");
const router = express.Router();
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  getRiders,
  getOrderById,
  updateStatus,
  assignRider,
} = require("../controllers/adminController");
const access_middleware = require("../middlewares/access-middleware");
const token_auth = require("../middlewares/token-auth");
const multer = require("multer");

// const upload = multer({ dest: "./uploads" });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/products",
  token_auth,
  access_middleware("admin"),
  upload.single("image"),
  createProduct,
);
router.patch(
  "/products/:id",
  upload.single("image"),
  // token_auth,
  // access_middleware("admin"),
  updateProduct,
);
router.delete("/products/:id", access_middleware("admin"), deleteProduct);

router.get("/orders", getOrders);
router.get("/orders/:id", getOrderById);
router.patch("/orders/status", access_middleware("admin"), updateStatus);

router.get("/riders", getRiders);

router.patch("/riders", assignRider);

module.exports = router;
