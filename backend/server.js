const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("./db/db");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { getUsers } = require("./controllers/userController");
const error_middleware = require("./middlewares/error-middleware");

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
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);

app.use("/users", getUsers);

//Auth APIs
app.use("/", authRoutes);

//admin access APIs
app.use("/products", adminRoutes);

//product APIs
app.use("/product", productRoutes);

//cart APIs
app.use("/cart", cartRoutes);

app.use(error_middleware);

app.listen(3000, () => {
  console.log("server is running on PORT:3000");
});
