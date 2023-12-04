const createProduct = async (req, res) => {
  res.json(`create product`);
};
const getAllProducts = async (req, res) => {
  res.json(`get all products`);
};
const getSingleProduct = async (req, res) => {
  res.json(`get single product`);
};
const updateProduct = async (req, res) => {
  res.json(`update product`);
};
const deleteProduct = async (req, res) => {
  res.json(`delete product`);
};
const uploadImage = async (req, res) => {
  res.json(`upload image`);
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
