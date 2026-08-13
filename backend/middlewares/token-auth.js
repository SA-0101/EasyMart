const jwt = require("jsonwebtoken");
const ACCESS_SECRET = process.env.ACCESS_SECRET;

const token_auth = async (req, res, next) => {
  const access_token = req.get("Authorization").split(" ")[1];
  const decode = jwt.verify(access_token, ACCESS_SECRET);
  if (!decode) {
    const err = {
      status: 201,
      message: "Invalid token",
    };
    return next(err);
  }
  req.user = decode;
  return next();
};
module.exports = token_auth;
