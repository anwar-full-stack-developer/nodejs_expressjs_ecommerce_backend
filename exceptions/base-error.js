class BaseError extends Error {
  constructor(msg, statusCode, isOperational, name) {
    super(name);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.isError = true;
    this.msg = msg;
    Error.captureStackTrace(this);
  }
}

module.exports = BaseError;
