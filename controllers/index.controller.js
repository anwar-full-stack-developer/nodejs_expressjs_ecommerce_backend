const {utill} = require("../utill/utill");
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
  test: async function (req, res, next) {
    // let result = utill.simpleArraySum([1,2,3,4,5,6,10,20])
    
    // let result = utill.compareTriplets([5,6,7], [3,6,10])
    // let result = utill.compareTriplets([17,28,30], [99,16,8])
    
    // let result = utill.aVeryBigSum([1000000001, 1000000002, 1000000003, 1000000004, 1000000005])


    // let result = utill.extraLongFactorials(25)
    let result = utill.extraLongFactorials(45)
    return res.json({ result: result });
  },
};
/**
 * @module CategoryController
 */
module.exports = IndexController;
