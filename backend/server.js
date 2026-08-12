const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("./db/db");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { getUsers } = require("./controllers/userController");
const {
  refresh_token,
  loginUser,
  logoutUser,
  registerUser,
} = require("./controllers/authController");
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  registerAdmin,
} = require("./controllers/adminController");
const token_auth = require("./middlewares/token-auth");
const access_middleware = require("./middlewares/access-middleware");

const CLIENT_URL = process.env.CLIENT_URL;

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Allowed HTTP methods
    credentials: true, // Allow cookies/auth headers
  }),
);

app.get("/users", getUsers);
app.post("/register", registerUser);
app.post(
  "/admin/register",
  token_auth,
  access_middleware("admin"),
  registerAdmin,
);
app.post("/login", loginUser);
app.post("/refresh", refresh_token);
app.get("/logout", logoutUser);

app.post("/products", token_auth, access_middleware("admin"), createProduct);
app.get(
  "/products",
  // token_auth,
  // access_middleware("admin", "customer"),
  getProducts,
);
app.patch(
  "/products/:id",
  token_auth,
  access_middleware("admin"),
  updateProduct,
);
app.delete(
  "/products/:id",
  token_auth,
  access_middleware("admin"),
  deleteProduct,
);

app.listen(3000, () => {
  console.log("server is running on PORT:3000");
});
