const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("./db/db");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { getUsers } = require("./controllers/userController");
// const {
//   refresh_token,
//   loginUser,
//   logoutUser,
//   registerUser,
// } = require("./controllers/authController");
// const {
//   createProduct,
//   getProducts,
//   updateProduct,
//   deleteProduct,
//   registerAdmin,
// } = require("./controllers/adminController");
// const token_auth = require("./middlewares/token-auth");
// const access_middleware = require("./middlewares/access-middleware");
const error_middleware = require("./middlewares/error-middleware");
// const {
//   getProductById,
//   getProductsByName,
// } = require("./controllers/productController");
// const {
//   viewCart,
//   addProduct,
//   removeProduct,
//   clearCart,
// } = require("./controllers/cartController");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const cartRoutes = require("./routes/cartRoutes");
const productRoutes = require("./routes/productRoutes");

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

app.use("/users", getUsers);

//Auth APIs
app.use("/", authRoutes);

app.use("/products", adminRoutes);

//Products details,filter APIs
app.use("/product", productRoutes);

//cart APIs

app.use("/cart", cartRoutes);

app.use(error_middleware);

app.listen(3000, () => {
  console.log("server is running on PORT:3000");
});
