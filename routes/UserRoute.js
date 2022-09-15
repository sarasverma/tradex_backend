const express = require("express");
const {
  registerUser,
  loginUser,
  logOut,
  forgotPassword,
  resetPassword,
  getUserDetail,
  updatePassword,
  updateProfile,
} = require("../controllers/UserController");
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logOut);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/me").get(isAuthenticatedUser, getUserDetail);
router.route("/me/update").put(isAuthenticatedUser, updateProfile);

module.exports = router;
