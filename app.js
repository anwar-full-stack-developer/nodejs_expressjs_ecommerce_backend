var createError = require("http-errors");

var multer = require("multer");
var upload = multer();

var express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
// console.log(process.env.DATABASE_DEFAULT_CONNECTION_STRING);
const port = process.env.PORT || 5000;
var path = require("path");
var cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
var logger = require("morgan");
const mongoose = require("mongoose");

const HttpStatusCodes = require("./constants/http-status-code.constant");
const httpResponseHelper = require("./helpers/http-response.helper");

const formDataParserMiddleware = require("./middlewares/form-data-parser.middleware");

const ApiNotFoundError = require("./exceptions/api-not-found-error");
const ApiBadRequest = require("./exceptions/api-bad-request-error");
const ApiInternalServerError = require("./exceptions/api-internal-server-error");

var categoryRouter = require("./routes/category.route");
var indexRouter = require("./routes/index.route");
var userRouter = require("./routes/user.route");
var authRouter = require("./routes/auth.route");
var productRouter = require("./routes/product.route");
var brandRouter = require("./routes/brand.route");

var app = express();

//Setup JSON response besed http status code for API
Object.assign(app.response, httpResponseHelper);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors());
app.use(logger("dev"));

app.use(cookieParser());

//application/x-www-form-urlencoded, application/json, and multipart/form-data.
// parse application/json
app.use(express.json());

// To support URL-encoded bodies
// app.use(bodyParser.urlencoded({ extended: true }));

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//multipart/form-data, user parser each route where POST or PUT request. Note no need to use parseFormData where use multa as middleware
// app.use(formDataParserMiddleware.parseFormData);

// for parsing multipart/form-data
// app.use(upload.array());
// app.use(upload.none());

app.use(express.static(path.join(__dirname, "public")));

//setup application routes
app.use("/api/v1/auth/basic/", authRouter);
// app.use('/api/v1/auth/jwt/', authRouter);
app.use("/api/v1/products/", productRouter);
app.use("/api/v1/category/", categoryRouter);
app.use("/api/v1/brands/", brandRouter);
app.use("/", indexRouter);
app.use("/api/v1/users/", userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// process.on('unhandledRejection', err => {
//   console.log('unhandledRejection', err);
//   process.exit()
// })

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
