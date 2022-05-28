const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const logger = require('./middlieware/logger');
const morgan = require('morgan');
// Routers
const users = require('./routes/users');
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const review = require('./routes/review');

const connectDB = require('./config/db');
const colors = require('colors');
const errorHandler = require('./middlieware/error');
const fileUpload = require('express-fileupload');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

// Security
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// LOAD env vars
dotenv.config({
  path: './config/config.env',
});
connectDB();
const app = express();
// Cookie Parser
app.use(cookieParser());

// Body Parser
app.use(express.json());
// app.use(express.urlencoded());
// app.use(express.json({ strict: false }));
// app.use(logger);
// dev loggin
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // INFO logger
}
// Sanitize  To remove data using these defaults:
app.use(mongoSanitize());
// Security extra headers
app.use(helmet());
app.use(xss()); //make sure this comes before any routes
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);
app.use(hpp());

// Cors
app.use(cors());

// FIle upload
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/v1/reviews', review);
app.use('/api/v1/users', users);
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
