const express = require("express");
const basicAuthentication = require("../middlewares/basic-authentication.middleware");
const productMiddleware = require("./../middlewares/product.middleware");
const ProductController = require("./../controllers/product.controller");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const imageStorage = multer.diskStorage({
  // Destination to store image
  destination: function (req, file, cb) {
    cb(null, "public/product-images/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
    // file.fieldname is name of the field (image)
    // path.extname get the uploaded file extension
  },
});

const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 1000000, // 1000000 Bytes = 1 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
      req.fileValidationError = "Only image files are allowed!";
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

router.route("/search").get(ProductController.search);

router
  .route("/byslug/:slug")
  .get([productMiddleware.validation.readBySlug, ProductController.readBySlug]);

router
  .route("/allbyuser")
  .get([
    basicAuthentication.requireLogin,
    basicAuthentication.setLoggedinUserToHttpRequestObject,
    ProductController.allProductsByUser,
  ]);

router.route("/").get(ProductController.all);

router.route("/").post([
  basicAuthentication.requireLogin,
  basicAuthentication.setLoggedinUserToHttpRequestObject,
  productMiddleware.checkExistOrCreateProductImageDir,
  productMiddleware.uploadImage.array("image", 4),
  productMiddleware.fixProductImageUrl,
  //product validation
  productMiddleware.validation.create,
  ProductController.create,
]);

router
  .route("/:id")
  .get([productMiddleware.validation.read, ProductController.read]);

router
  .route("/:id")
  .put([
    basicAuthentication.requireLogin,
    basicAuthentication.setLoggedinUserToHttpRequestObject,
    productMiddleware.checkExistOrCreateProductImageDir,
    productMiddleware.uploadImage.array("image", 4),
    productMiddleware.fixProductImageUrl,
    productMiddleware.validation.update,
    ProductController.update,
  ]);

router
  .route("/:id")
  .delete([
    basicAuthentication.requireLogin,
    basicAuthentication.setLoggedinUserToHttpRequestObject,
    productMiddleware.validation.delete,
    ProductController.delete,
  ]);

module.exports = router;
