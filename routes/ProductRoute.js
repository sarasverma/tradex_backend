const express = require("express");
const {
  getAllProduct,
  addProduct,
  deleteProduct,
  updateProduct,
  getProduct,
} = require("../controllers/ProductsController");
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.route("/").get(getAllProduct);
router
  .route("/addnew")
  .post(isAuthenticatedUser, authorizeRoles("admin"), addProduct);
router
  .route("/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct)
  .get(getProduct);

module.exports = router;
