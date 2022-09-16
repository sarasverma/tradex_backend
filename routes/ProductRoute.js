const express = require("express");
const {
  getAllProduct,
  addProduct,
  deleteProduct,
  updateProduct,
  getProduct,
  addProductReview,
  getProdcutReviews,
  deleteReviews,
} = require("../controllers/ProductsController");
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.route("/products").get(getAllProduct);
router
  .route("/admin/products/addnew")
  .post(isAuthenticatedUser, authorizeRoles("admin"), addProduct);
router
  .route("/admin/products/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);
router.route("/products/:id").get(getProduct);
router.route("/review").put(isAuthenticatedUser, addProductReview);
router
  .route("/reviews")
  .get(getProdcutReviews)
  .delete(isAuthenticatedUser, deleteReviews);

module.exports = router;
