exports.getBootcamps = (req, res, next) => {
  res.json({ success: true, msg: "Show all bootcamps", hello: req.hello });
};

exports.getBootcamp = (req, res, next) => {
  res.json({
    success: true,
    msg: `Get the bootcamps with id ${req.params.id}`,
  });
};

exports.createBootcamp = (req, res, next) => {
  res.json({ success: true, msg: "Create new Bootcamp" });
};
exports.updateBootcamp = (req, res, next) => {
  res.json({ success: true, msg: `Update a Bootcamp ${req.params.id}` });
};
exports.revomeBootcamp = (req, res, next) => {
  res.json({ success: true, msg: `Remove  Bootcamp ${req.params.id}` });
};
