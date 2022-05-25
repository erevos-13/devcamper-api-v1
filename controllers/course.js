const Course = require('../models/Course');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlieware/async');
const Bootcamp = require('../models/Bootcamp');

exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });
    return res.status(200).json({
      count: courses.length,
      success: true,
      data: courses,
    });
  } else {
    return res.status(200).json(res.advancedResults);
  }
});

exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });
  if (!course) {
    return next(
      new ErrorResponse(`Course not found with id: ${req.params.id}`, 404)
    );
  }
  res.status(201).json({
    success: true,
    data: course,
  });
});

exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with id: ${req.params.bootcampId}`,
        404
      )
    );
  }
  const course = await Course.create(req.body);
  res.status(201).json({
    success: true,
    data: course,
  });
});

exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });
  if (!course) {
    return next(
      new ErrorResponse(`Course not found with id: ${req.params.id}`, 404)
    );
  }
  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(201).json({
    success: true,
    data: course,
  });
});

exports.deleteCourse = asyncHandler(async (req, res, next) => {
  console.log('delte course');
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(`Course not found with id: ${req.params.id}`, 404)
    );
  }

  console.log(`remove ${course}`);

  res.status(201).json({
    success: true,
    data: {},
  });
});
