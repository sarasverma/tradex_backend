const Product = require("../models/ProductModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");

// Add product -- admin
exports.addProduct = catchAsyncError(async (req, res) => {
  const product = await Product.create(req.body);
  return res.status(200).json({
    success: true,
    product,
  });
});

// Get all product
exports.getAllProduct = catchAsyncError(async (req, res) => {
  const resultPerPage = 5;
  const productsCount = await Product.countDocuments();

  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const products = await apiFeatures.query;
  res.status(200).json({ sucess: true, products });
});

// Get product
exports.getProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  return res.status(200).json({
    success: true,
    product,
    productsCount,
  });
});

// Update product -- admin
exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
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
});

// Delete product -- admin
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  await product.remove();
  return res.status(200).json({
    success: true,
    message: "Product deleted",
  });
});
