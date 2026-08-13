const error_middleware = (err, req, res, next) => {
  console.log(err);
  const status = err.status || 500;
  const message = err.status ? err.message : "something went wrong";
  res.status(status).json({ message: message });
};
module.exports = error_middleware;
