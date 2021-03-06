const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlieware/async');
const path = require('path');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

exports.registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    role,
  });
  //   if (user) {
  //     return next(new ErrorResponse(`User already exist: ${req.params.id}`, 404));
  //   }
  const token = user.getSignedJwtToken();
  res.status(200).json({
    success: true,
    token,
  });
});

exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorResponse(`Please provide an email and password`, 400));
  }
  const user = await User.findOne({
    email,
  }).select('+password');

  if (!user) {
    return next(new ErrorResponse(`Invalid credentials`, 401));
  }
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse(`Invalid credentials`, 401));
  }
  // const token = user.getSignedJwtToken();
  // res.status(200).json({
  //   success: true,
  //   token,
  // });
  sendTokenResponse(user, 200, res);
});

// Get token from model , create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }
  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.logoutUser = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 100),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
  });
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorResponse(`There is no user that email`, 404));
  }
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`;
  const message = `You are receiving this email because you (or someone else) has requested the reset of the password. Please make a PUT request to : \n\n ${resetUrl}`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
    });
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse(`Email could not be sent`, 500));
  }
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ErrorResponse(`Invalid token`, 400));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };
  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(new ErrorResponse(`User is not found`, 400));
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.updatePassword = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    newPassword: req.body.newPassword,
    currentPassword: req.body.currentPassword,
  };
  const user = await User.findByIdAndUpdate(req.user.id).select('+password');
  if (!(await user.matchPassword(fieldsToUpdate.currentPassword))) {
    return next(new ErrorResponse(`Password is incorrect`, 401));
  }
  user.password = fieldsToUpdate.newPassword;
  await user.save();
  sendTokenResponse(user, 200, res);
});
