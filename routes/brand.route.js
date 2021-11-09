var express = require("express");

const multer = require("multer");

const brandMiddleware = require("./../middlewares/brand.middleware");
const basicAuthentication = require("../middlewares/basic-authentication.middleware");
const BrandController = require("../controllers/brand.controller");
var router = express.Router();

//do maintain route sequence
router.route("/search").get(BrandController.search);

router
  .route("/byslug/:slug")
  .get([brandMiddleware.requireParamsSlug, BrandController.readBySlug]);
//all
router.route("/").get(BrandController.all);

router
  .route("/")
  .post([
    // multer().none(), //to parse multiplepart form data without image upload
    basicAuthentication.requireLoginAsAdmin,
    brandMiddleware.checkExistOrCreateImageDir,
    brandMiddleware.uploadImage.array("logo", 1),
    brandMiddleware.fixImageUrl,
    brandMiddleware.validation.create,
    BrandController.create,
  ]);

router
  .route("/:id")
  .get([brandMiddleware.requireParamsId, BrandController.read]);

router
  .route("/:id")
  .put([
    brandMiddleware.requireParamsId,
    basicAuthentication.requireLoginAsAdmin,
    //logo upload
    brandMiddleware.checkExistOrCreateImageDir,
    brandMiddleware.uploadImage.array("logo", 1),
    brandMiddleware.fixImageUrl,
    //endpoint
    BrandController.update,
  ]);

router
  .route("/:id")
  .delete([
    basicAuthentication.requireLoginAsAdmin,
    // brandMiddleware.requireParamsId,
    brandMiddleware.validation.delete,
    BrandController.delete,
  ]);

module.exports = router;
