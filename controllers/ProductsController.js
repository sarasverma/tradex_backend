const Product = require("../models/ProductModel");

// Add product -- admin
exports.addProduct = async (req, res) => {
  const product = await Product.create(req.body);
  return res.status(200).json({
    success: true,
    product,
  });
};

// Get all product
exports.getAllProduct = async (req, res) => {
  const products = await Product.find();
  res.status(200).json({ sucess: true, products });
};

// Get product
exports.getProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res
      .status(500)
      .json({ success: false, message: "Product not found" });
  }
  return res.status(200).json({
    success: true,
    product,
  });
};

// Update product -- admin
exports.updateProduct = async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return res
      .status(500)
      .json({ success: false, message: "Product not found" });
  }
  console.log(req.body);
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  });

  return res.status(200).json({
    success: true,
    product,
  });
};

// Delete product -- admin
exports.deleteProduct = async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return res
      .status(500)
      .json({ success: false, message: "Product not found" });
  }
  await product.remove();
  return res.status(200).json({
    success: true,
    message: "Product deleted",
  });
};
