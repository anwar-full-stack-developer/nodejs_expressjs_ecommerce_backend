const HttpStatusCodes = require("../constants/http-status-code.constant");
const BaseError = require("./base-error");

class ApiAuthenticationError extends BaseError {
  constructor(
    msg,
    statusCode = HttpStatusCodes.AUTHENTICATION_REQUIRED,
    isOperational = true,
    name = "Authentication / Login required"
  ) {
    super(msg, statusCode, isOperational, name);
  }
}

module.exports = ApiAuthenticationError;
