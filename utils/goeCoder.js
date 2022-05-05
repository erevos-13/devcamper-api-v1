const NodeGeocoder = require("node-geocoder");

const options = {
  provider: "mapquest",
  httpAdapter: "https",
  apiKey: "q3v4ieGi5bwNtyGXxdxAm07xJWbUiwL6",
  formatter: null,
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
