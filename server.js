const express = require("express");
const dotenv = require("dotenv");

const logger = require("./middlieware/logger");
const morgan = require("morgan");
// Routers
const bootcamps = require("./routes/bootcamps");
const connectDB = require("./config/db");
const colors = require("colors");
// LOAD env vars
dotenv.config({
  path: "./config/config.env",
});
connectDB();
const app = express();

// app.use(logger);
// dev loggin
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mount routers
app.use("/api/v1/bootcamps", bootcamps);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
      .yellow.bold
  )
);

// Handler DB rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`UnhandledRejection Error: ${err}`);
  // Close server & exit proses
  server.close(() => process.exit(1));
});