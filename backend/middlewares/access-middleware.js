const access_middleware = (...authorizedRole) => {
  return (req, res, next) => {
    if (!authorizedRole.includes(req.user.role)) {
      const err = {
        status: 201,
        message: "access denied",
      };
      return next(err);
    }
    next();
  };
};
module.exports = access_middleware;
