const addProduct = (req, res) => {
  res.send("add product to cart");
};
const viewCart = (req, res) => {
  const id = req.user.id;
  console.log("user id is ", id);
  res.send(req.user.id);
};
const updateQuantity = (req, res) => {
  res.send("update quantity");
};
const removeProduct = (req, res) => {
  res.send("remove product");
};
const clearCart = (req, res) => {
  res.send("clear cart");
};

module.exports = {
  addProduct,
  viewCart,
  updateQuantity,
  removeProduct,
  clearCart,
};
