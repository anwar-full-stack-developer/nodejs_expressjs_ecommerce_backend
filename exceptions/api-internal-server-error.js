const HttpStatusCodes = require("../constants/http-status-code.constant");
const BaseError = require("./base-error");

class ApiInternalServerError extends BaseError {
  constructor(
    msg,
    statusCode = HttpStatusCodes.INTERNAL_SERVER,
    isOperational = true,
    name = "Internal server error or something went wrong."
  ) {
    super(msg, statusCode, isOperational, name);
  }
}

module.exports = ApiInternalServerError;
