const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlieware/async');
const path = require('path');

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
  console.log({ user });
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
  const token = user.getSignedJwtToken();
  res.status(200).json({
    success: true,
    token,
  });
});