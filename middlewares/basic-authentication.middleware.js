const User = require("../models/User");

const basicAuthentication = {
  requireLoginAsAdmin: async (req, res, next) => {
    req.loggedinUser = {};
    const token = req.header("authorization")?.replace("Bearer ", "");
    if (token) {
      //do the rest staff here
      try {
        const user = await User.findOne({ token: token, isAdmin: true });
        if (user) {
          req.loggedinUser = user;
          next();
        } else {
          return res.jsonAuthenticationError(
            "Invalid login credential/token. Require admin to login"
          );
        }
      } catch (error) {
        console.log("error from requireLoginAsAdmin", error);
      }
    } else {
      return res.jsonAuthenticationError(
        "Invalid login credential/token. Require admin to login"
      );
    }
  },

  requireLogin: async (req, res, next) => {
    req.loggedinUser = {};
    const token = req.header("authorization")?.replace("Bearer ", "");
    if (token) {
      //do the rest staff here
      try {
        const user = await User.findOne({ token: token });
        if (user) {
          req.loggedinUser = user;
          next();
        } else {
          return res.jsonAuthenticationError(
            "Invalid login credential/token. Require admin to login"
          );
        }
      } catch (error) {
        console.log("error from requireLogin", error);
      }
    } else {
      return res.jsonAuthenticationError(
        "Invalid login credential/token. Require admin to login"
      );
    }
  },

  setLoggedinUserToHttpRequestObject: async (req, res, next) => {
    req.loggedinUser = {};
    const token = req.header("authorization")?.replace("Bearer ", "");
    if (token) {
      try {
        const user = await User.findOne({ token: token }).exec();
        if (user) {
          req.loggedinUser = user;
        }
      } catch (error) {        
        console.log("error from ", __filename, "setLoggedinUserToHttpRequestObject", error);
      }
    }
    next();
  },
};

module.exports = basicAuthentication;
