const placeOrder = async (req, res, next) => {
  res.send("order placed");
};

const retrieveOrders = async (req, res, next) => {
  res.send("order get");
};

module.exports = { placeOrder, retrieveOrders };
