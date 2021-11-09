const niv = require("node-input-validator");
const mongoose = require("mongoose");
const User = require("../models/User");
const {USER_TYPE_ALLOWED_FOR_REGISTRATION} = require("./../constants/user.constant");

//custom rules
niv.extend("authRequireEmailExist", async ({ value }) => {
  try {
    const b = await User.findOne({ email: value.trim() }).exec();
    if (b) {
      return true;
    }
  } catch (error) {
    console.log("validation error authRequireEmailExist", error);
  }
  return false;
});

//custom rules
niv.extend("authRequireResetTokenExist", async ({ value }) => {
  try {
    const b = await User.findOne({ password_reset_token: value.trim() }).exec();
    if (b) {
      return true;
    }
  } catch (error) {
    console.log("validation error authRequireEmailExist", error);
  }
  return false;
});

//custom rules
niv.extend("authIsEmailExist", async ({ value }) => {
  try {
    const b = await User.findOne({ email: value.trim() }).exec();
    if (b) {
      return false;
    }
  } catch (error) {
    console.log("validation error isEmailExist", error);
  }
  return true;
});

//custom rules
niv.extend("authIsValidUserType", ({ value }) => {
  const userType = USER_TYPE_ALLOWED_FOR_REGISTRATION;
  if (userType.includes(value)) {
    return true;
  }
  return false;
});

const authMiddleware = {
  validation: {
    login: async function (req, res, next) {
      const v = new niv.Validator(
        { ...req.body },
        {
          email: ["required", "email", "authRequireEmailExist"],
          password: ["required", "string", "minLength:6"],
        },
        {
          "email.authRequireEmailExist":
            "Email address {:value} does not exists",
        }
      );

      const isValid = await v.check();
      if (!isValid) {
        console.log(v.errors);
        return res.jsonValidationError({ error: v.errors });
      }
      next();
    },

    register: async function (req, res, next) {
      const v = new niv.Validator(
        { ...req.body },
        {
          email: ["required", "string", "email", "authIsEmailExist"],
          first_name: ["required", "string", "minLength:3"],
          password: [
            "required",
            "string",
            "minLength:6",
            "same:confirm_password",
          ],
          confirm_password: ["required", "string", "minLength:6"],
          user_type: ["required", "string", "authIsValidUserType"],
        },
        {
          "email.authIsEmailExist": "Email address {:value} already exists",
          "user_type.authIsValidUserType": "{:value} is invalid user type",
        }
      );

      const isValid = await v.check();
      if (!isValid) {
        console.log(v.errors);
        return res.jsonValidationError({ error: v.errors });
      }
      next();
    },
    forgotPassword: async function (req, res, next) {
      const v = new niv.Validator(
        { ...req.body },
        {
          email: ["required", "email", "authRequireEmailExist"],
        },
        {
          "email.authRequireEmailExist":
            "Email address {:value} does not exists",
        }
      );

      const isValid = await v.check();
      if (!isValid) {
        console.log(v.errors);
        return res.jsonValidationError({ error: v.errors });
      }
      next();
    },
    resetPassword: async function (req, res, next) {
      const v = new niv.Validator(
        { ...req.body },
        {
          password_reset_token: ["required", "authRequireResetTokenExist"],
          password: [
            "required",
            "string",
            "minLength:6",
            "same:confirm_password",
          ],
          confirm_password: ["required", "string", "minLength:6"],
        },
        {
          "password_reset_token.authRequireResetTokenExist": "Invalid password reset token",
        }
      );

      const isValid = await v.check();
      if (!isValid) {
        console.log(v.errors);
        return res.jsonValidationError({ error: v.errors });
      }
      next();
    },
  },
};

module.exports = authMiddleware;
