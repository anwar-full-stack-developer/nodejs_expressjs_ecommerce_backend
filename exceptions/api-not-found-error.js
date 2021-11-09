const HttpStatusCodes = require("../constants/http-status-code.constant");
const BaseError = require("./base-error");

class ApiNotFoundError extends BaseError {
  constructor(
    msg,
    statusCode = HttpStatusCodes.NOT_FOUND,
    isOperational = true,
    name = "Not found."
  ) {
    super(msg, statusCode, isOperational, name);
  }
}

module.exports = ApiNotFoundError;
