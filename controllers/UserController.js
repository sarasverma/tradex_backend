const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/UserModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

// Register a user
exports.registerUser = catchAsyncError(async (req, res, next) => {
  // for uploading avatar to cloudinary
  let avatar = { public_id: "", url: "" };
  // req.files.avatar  -> for postman
  if (req.body.avatar) {
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });
    avatar.public_id = myCloud.public_id;
    avatar.url = myCloud.secure_url;
  }

  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar,
  });

  sendToken(user, 201, res);
});

// Login for users
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }
  // password alag se select karna padega
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  sendToken(user, 200, res);
});

// Logout users
exports.logOut = catchAsyncError(async (req, res, next) => {
  // cookie ko hatane ke liye
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    sucess: true,
    message: "Logged out",
  });
});

// Forgot password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Get user password token
  const resetToken = user.getResetPasswordToken();

  // save user to save reset token and expire to user schema
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset link is  :- \n \n ${resetPasswordUrl}\n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `TradeX Passord reset`,
      message,
    });
    res.status(200).json({
      sucess: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  // create token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset password token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("Password and confirm password does not match", 400)
    );
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// Get user details
exports.getUserDetail = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({ sucess: true, user });
});

// update user password
exports.updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmNewPassword) {
    return next(
      new ErrorHandler(
        "New password and confirm new password doesn't match",
        400
      )
    );
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

// update user profile
exports.updateProfile = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);
    const imageId = user.avatar.public_id;

    // Delete previous image
    await cloudinary.v2.uploader.destroy(imageId);

    // Upload new image
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({ sucess: true });
});

// Get all users -- admin
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    sucess: true,
    users,
  });
});

// Get single user --admin
exports.getUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with id ${req.body.params}`)
    );
  }
  res.status(200).json({ sucess: true, user });
});

// update user role -- admin
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with id : ${req.params.id}`)
    );
  }
  res.status(200).json({ sucess: true, message: "User updated successfully" });
});

// delete user -- admin
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  // have to implement something to delete avtar

  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with id : ${req.params.id}`)
    );
  }

  await user.remove();

  res.status(200).json({ sucess: true, message: "User deleted successfully" });
});
