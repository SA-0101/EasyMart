const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { getUsers } = require("./controllers/userController");
const error_middleware = require("./middlewares/error-middleware");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const cartRoutes = require("./routes/cartRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const riderRoutes = require("./routes/riderRoutes");
const userRoutes = require("./routes/userRoutes");
const corsFunc = require("./middlewares/cors");
const token_auth = require("./middlewares/token-auth");
const access_middleware = require("./middlewares/access-middleware");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsFunc()));

//User APIs
app.use("/api/users", token_auth, userRoutes);
//Auth APIs
app.use("/api", authRoutes);
//admin access APIs
app.use("/api/admin", adminRoutes);
//product APIs
app.use("/api/products", productRoutes);
//cart APIs
app.use("/api/cart", token_auth, cartRoutes);
//order APIs
app.use("/api/orders", token_auth, orderRoutes);
//rider APIs
app.use("/api/riders", token_auth, riderRoutes);

app.use(error_middleware);
app.listen(3000, () => {
  console.log("server is running on PORT:3000");
});
