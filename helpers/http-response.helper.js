const HttpStatusCodes = require("./../constants/http-status-code.constant");
const ApiNotFoundError = require("./../exceptions/api-not-found-error");
const ApiBadRequest = require("./../exceptions/api-bad-request-error");
const ApiInternalServerError = require("./../exceptions/api-internal-server-error");
const ApiAuthenticationError = require("./../exceptions/api-authentication-error");
const ApiValidaionError = require("./../exceptions/api-validation-error");

const httpResponseHelper = {
  jsonNotFoundError: function (message) {
    const error = new ApiNotFoundError(message);
    return this.contentType("application/json")
      .status(error.statusCode)
      .send(error);
  },

  jsonBadRequestError: function (message) {
    const error = new ApiBadRequest(message);
    return this.contentType("application/json")
      .status(error.statusCode)
      .send(error);
  },

  jsonInternalServerError: function (data) {
    const message = "Internal server error or something went wrong!";
    const error = new ApiInternalServerError(message);
    return this.contentType("application/json")
      .status(error.statusCode)
      .send({ ...error, ...data });
  },

  jsonOK: function (data) {
    return this.contentType("application/json")
      .status(HttpStatusCodes.OK)
      .send({ statusCode: HttpStatusCodes.OK, message: "Data found", ...data });
  },

  jsonCreated: function (data) {
    return this.contentType("application/json")
      .status(HttpStatusCodes.CREATED)
      .send({
        statusCode: HttpStatusCodes.CREATED,
        message: "Data has been created",
        ...data,
      });
  },

  jsonUpdated: function (data) {
    return this.contentType("application/json")
      .status(HttpStatusCodes.UPDATED)
      .send({
        statusCode: HttpStatusCodes.UPDATED,
        message: "Data has been updated",
        ...data,
      });
  },

  jsonDeleted: function (data) {
    return this.contentType("application/json")
      .status(HttpStatusCodes.DELETED)
      .send({
        statusCode: HttpStatusCodes.DELETED,
        message: "Data has been deleted",
        ...data,
      });
  },

  jsonAuthenticationError: function (message) {
    const error = new ApiAuthenticationError(message);
    return this.contentType("application/json")
      .status(error.statusCode)
      .send({
        statusCode: error.statusCode,
        message: message ? message : "Authentication/Login required",
        // ...data,
      });
  },

  jsonValidationError: function (data) {
    const message = data.message ? data.message : "Request params or form validation error";
    const error = new ApiValidaionError(message);
    return this.contentType("application/json")
      .status(error.statusCode)
      .send({
        statusCode: error.statusCode,
        message: message,
        msg: message,
        ...data,
      });
  },  
};

module.exports = httpResponseHelper;
