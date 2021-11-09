const HttpStatusCodes = require("../constants/http-status-code.constant");
const BaseError = require("./base-error");

class ApiValidationError extends BaseError {
  constructor(
    msg,
    statusCode = HttpStatusCodes.VALIDATION_ERROR,
    isOperational = true,
    name = "Params or form data validation failed"
  ) {
    super(msg, statusCode, isOperational, name);
  }
}

module.exports = ApiValidationError;
