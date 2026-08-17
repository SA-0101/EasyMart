const express = require("express");
const { getUsers } = require("../controllers/userController");
const {
  registerUser,
  loginUser,
  refresh_token,
  logoutUser,
} = require("../controllers/authController");
const token_auth = require("../middlewares/token-auth");
const access_middleware = require("../middlewares/access-middleware");
const { registerAdmin } = require("../controllers/adminController");
const router = express.Router();

router.post("/register", registerUser);

router.post(
  "/admin/register",
  token_auth,
  access_middleware("admin"),
  registerAdmin,
);

router.post("/login", loginUser);
router.get("/refresh", refresh_token);
router.get("/logout", logoutUser);

module.exports = router;
