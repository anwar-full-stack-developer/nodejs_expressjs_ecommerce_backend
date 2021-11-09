/**
 * Index controller handaling main request
 * @module CategoryController
 * @api IndexController
 */
let IndexController = {
  /**
   * To serve a Simple HTTP get request
   * @name main
   * @async
   * @function
   * @method GET
   * @param {Object} req - HTTP request object
   * @param {Object} res - HTTP response object
   * @param {Function} next - Callback function to dispatch next route
   * @callback next
   * @returns {Object} success response JSON Object
   * @returns {Object} error response JSON Object
   */
  main: async function (req, res, next) {
    return res.json({ result: "Main/home request" });
  },
};
/**
 * @module CategoryController
 */
module.exports = IndexController;
