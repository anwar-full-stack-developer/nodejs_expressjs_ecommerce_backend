const bcrypt = require("bcrypt");
const User = require("./../models/User");

/**
 * Login, Register, ForgotPassword, ResetPassword operation for HTTP request endpoints. Allowed method only POST.
 * @module AuthController
 * @api AuthController
 */
let AuthController = {
  /**
   * Create new brand
   * @name login
   * @async
   * @function
   * @method POST
   * @param {Object} req - HTTP request object
   * @param {String} req.body.email - email: unique email address
   * @param {String} req.body.password - password: to login user account associated with email
   * @param {Object} res - HTTP response object
   * @param {Function} next - Callback function to dispatch next route
   * @callback next
   * @returns {Object} success response JSON Object with login token
   * @returns {Object} error response JSON Object
   */
  login: async function (req, res, next) {
    const body = req.body;

    try {
      const user = await User.findOne({ email: body.email });
      if (!user)
        return res.jsonValidationError({
          error: {
            email: { message: `Email address {${body.email}} does not exists` },
          },
        });
      // check user password with hashed password stored in the database
      const validPassword = await bcrypt.compare(body.password, user.password);
      if (!validPassword)
        return res.jsonValidationError({
          error: { password: { message: "Invalid Password" } },
        });
      return res.jsonOK({
        message: "Valid password",
        result: {
          token: user.token,
          bearer: `Bearer ${user.token}`,
        },
      });
    } catch (err) {
      return res.jsonInternalServerError({ error: err });
    }
  },

  /**
   * User registration for new account
   * @name register
   * @async
   * @function
   * @method POST
   * @param {Object} req - HTTP request object
   * @param {String} req.body.email - email: unique email address
   * @param {String} req.body.password - password: to login user account associated with email
   * @param {String} req.body.first_name - first_name: user first name
   * @param {String} req.body.user_type - Buyer, Seller, Both, Admin, SuperAdmin
   * @param {Object} res - HTTP response object
   * @param {Function} next - Callback function to dispatch next route
   * @callback next
   * @returns {Object} success response JSON Object with login token
   * @returns {Object} error response JSON Object
   */
  register: async function (req, res, next) {
    const body = req.body;

    try {
      let user = await User.findOne({ email: body.email });
      if (user)
        return res.jsonValidationError({ error: {email: {message: "Email already exist"}} });

      user = new User(body);
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      user.token = await bcrypt.hash(
        [user.email, user.password, user.user_type, user.first_name].join("_"),
        salt
      );
      await user.save();
      return res.jsonCreated({
        message: "User registration successfull",
        result: {
          message: "User registration successfull",
          user: user,
        },
      });
    } catch (err) {
      return res.jsonInternalServerError({ error: err });
    }
  },

  /**
   * To get an email with reset password link
   * @name forgotPassword
   * @async
   * @function
   * @method POST
   * @param {Object} req - HTTP request object
   * @param {String} req.body.email - email: unique email address
   * @param {Object} res - HTTP response object
   * @param {Function} next - Callback function to dispatch next route
   * @callback next
   * @returns {Object} success response JSON Object with login token
   * @returns {Object} error response JSON Object
   */
  forgotPassword: async function (req, res, next) {
    const body = req.body;
    try {
      const user = await User.findOne({ email: body.email });
      if (!user) {
        return res.status(401).json({
          error: {
            email: {
              message: `Email address {${body.email}} does not exists`,
            },
          },
        });
      }
      const salt = await bcrypt.genSalt(10);
      const reset_str = await bcrypt.genSalt(10);
      user.password_reset_token = (await bcrypt.hash(reset_str, salt)).replace("/","");
      await user.save();
      return res.jsonUpdated({
        message: "Password reset token has been generated. Please check your email.",
        password_reset_token: user.password_reset_token,
        additionalMessage: "Password reset token will not be shown in production mode!"
      });
    } catch (err) {
      return res.jsonInternalServerError({ error: err });
    }
  },
  /**
   * Set a new password for user account, request with reset password token
   * @name resetPassword
   * @async
   * @function
   * @method POST
   * @param {Object} req - HTTP request object
   * @param {String} req.body.password_reset_token - a token to reset passeord
   * @param {String} req.body.password - new passeord to login user account
   * @param {String} req.body.confirm_password - verify password that password and confirm password is same
   * @param {Object} res - HTTP response object
   * @param {Function} next - Callback function to dispatch next route
   * @callback next
   * @returns {Object} success response JSON Object with login token
   * @returns {Object} error response JSON Object
   */
  resetPassword: async function (req, res, next) {
    const body = req.body;
    if (
      !(body.password_reset_token && body.password && body.confirm_password)
    ) {
      return res.status(400).send({ error: "Data not formatted properly" });
    }
    try {
      const user = await User.findOne({
        password_reset_token: body.password_reset_token,
      });
      if (!user) {
        return res.jsonValidationError({
          error: "Invalid password reset token",
        });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(body.password, salt);
      user.password_reset_token = "";
      await user.save();
      return res.jsonUpdated({
        message: "Password reset successful.",
        token: user.token,
      });
    } catch (err) {
      return res.jsonInternalServerError({ error: err });
    }
  },
};

/**
 * @module AuthController
 */
module.exports = AuthController;
