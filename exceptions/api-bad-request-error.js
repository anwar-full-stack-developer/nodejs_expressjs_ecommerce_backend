const HttpStatusCodes = require("../constants/http-status-code.constant");
const BaseError = require("./base-error");

class ApiBadRequest extends BaseError {
  constructor(
    msg,
    statusCode = HttpStatusCodes.BAD_REQUEST,
    isOperational = true,
    name = "Bad Request"
  ) {
    super(msg, statusCode, isOperational, name);
  }
}

module.exports = ApiBadRequest;
