const Product = require("../models/ProductModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");

// Add product -- admin
exports.addProduct = catchAsyncError(async (req, res) => {
  // for added by user ke liye
  req.body.user = req.user.id;

  const product = await Product.create(req.body);
  return res.status(200).json({
    success: true,
    product,
  });
});

// Get all product
exports.getAllProduct = catchAsyncError(async (req, res) => {
  const resultPerPage = 8;
  const productsCount = await Product.countDocuments();

  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();

  let products = await apiFeatures.query;

  let filterProductsCount = products.length;

  apiFeatures.pagination(resultPerPage);

  // for running duplicate query again
  products = await apiFeatures.query.clone();

  res.status(200).json({
    sucess: true,
    products,
    productsCount,
    resultPerPage,
    filterProductsCount,
  });
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

// Create new review or update review
exports.addProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user.id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        (rev.rating = rating), (rev.comment = comment);
      }
    });
  } else {
    product.reviews.push(review);
    product.noOfReviews = product.reviews.length;
  }

  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.rating = avg / product.reviews.length;

  await product.save({
    validateBeforeSave: false,
  });

  res.status(200).json({ success: true });
});

// Get all reviews
exports.getProdcutReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({ sucess: true, reviews: product.reviews });
});

// Delete reviews
exports.deleteReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });
  const rating = avg / reviews.length;
  const noOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      rating,
      noOfReviews,
    },
    { new: true, runValidators: true, useFindAndModify: false }
  );

  res.status(200).json({ sucess: true });
});
