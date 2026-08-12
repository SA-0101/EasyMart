const access_middleware = (...authorizedRole) => {
  return (req, res, next) => {
    if (!authorizedRole.includes(req.user.role)) {
      return res.json({ message: "access denied" });
    }
    next();
  };
};
module.exports = access_middleware;
