const express = require('express');
const dotenv = require('dotenv');

const logger = require('./middlieware/logger');
const morgan = require('morgan');
// Routers
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');

const connectDB = require('./config/db');
const colors = require('colors');
const errorHandler = require('./middlieware/error');
const fileUpload = require('express-fileupload');
const path = require('path');
// LOAD env vars
dotenv.config({
  path: './config/config.env',
});
connectDB();
const app = express();
// Body Parser
app.use(express.json());
// app.use(express.urlencoded());
// app.use(express.json({ strict: false }));
// app.use(logger);
// dev loggin
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// FIle upload
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));
// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use(errorHandler);
const PORT = process.env.PORT || 3000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
      .yellow.bold
  )
);

// Handler DB rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`UnhandledRejection Error: ${err}`);
  // Close server & exit proses
  server.close(() => process.exit(1));
});
