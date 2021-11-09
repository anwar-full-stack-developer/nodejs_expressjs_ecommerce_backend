var express = require("express");
const authMiddleware = require("./../middlewares/auth.middleware");
const AuthController = require("./../controllers/auth.controller");
var router = express.Router();

router
  .route("/login")
  .post([authMiddleware.validation.login, AuthController.login]);

router
  .route("/register")
  .post([authMiddleware.validation.register, AuthController.register]);

router
  .route("/forgot-password")
  .post([
    authMiddleware.validation.forgotPassword,
    AuthController.forgotPassword,
  ]);

router
  .route("/reset-password")
  .post([
    authMiddleware.validation.resetPassword,
    AuthController.resetPassword,
  ]);

module.exports = router;
