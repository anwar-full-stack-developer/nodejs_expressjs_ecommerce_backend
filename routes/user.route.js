const express = require("express");
const basicAuthentication = require("../middlewares/basic-authentication.middleware");
const formDataParserMiddleware = require("../middlewares/form-data-parser.middleware");
const userMiddleware = require("../middlewares/user.middleware");
const UserController = require("./../controllers/user.controller");
var router = express.Router();

//Only admin can perform these action
// router.route("/search").get(UserController.search);
// router.route("/byemail/:slug").get(UserController.readByEmail);
// router.route("/").get(UserController.all);
// router.route("/").post(basicAuthentication.requireLogin, UserController.create);


router.route("/upload-profile-picture").put([
  basicAuthentication.requireLogin,
  // formDataParserMiddleware.parseFormData,
  
  userMiddleware.checkExistOrCreateProfilePictureDir,
  userMiddleware.uploadProfilePicture.array("profile_picture", 1),
  userMiddleware.fixProfilePictureUrl,

  UserController.uploadProfilePicture,
]);

router.route("/").get([basicAuthentication.requireLogin, UserController.read]);

router.route("/").put([
  basicAuthentication.requireLogin,
  formDataParserMiddleware.parseFormData,
  //require validation
  userMiddleware.validation.update,
  UserController.update,
]);



// router
//   .route("/")
//   .delete([basicAuthentication.requireLogin, UserController.delete]);

module.exports = router;
