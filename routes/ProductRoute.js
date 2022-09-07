const express = require("express");
const {
  getAllProduct,
  addProduct,
  deleteProduct,
  updateProduct,
  getProduct,
} = require("../controllers/ProductsController");
const router = express.Router();

router.route("/").get(getAllProduct);
router.route("/addnew").post(addProduct);
router.route("/:id").put(updateProduct).delete(deleteProduct).get(getProduct);

module.exports = router;
