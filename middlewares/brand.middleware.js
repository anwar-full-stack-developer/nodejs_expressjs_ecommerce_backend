const path = require("path");
const fs = require("fs");
const multer = require("multer");
const {BRAND_UPLOAD_DIR, BRAND_UPLOAD_DIR_TEMP} = require("./../constants/brand.constant");
const brandValidation = require("./../validations/brand.validation");


const tempUploadDir = path.resolve(BRAND_UPLOAD_DIR_TEMP);
const uploadDir = path.resolve(BRAND_UPLOAD_DIR);

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
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

const uploadImage = multer({
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


const brandMiddleware = {
  requireParamsId: async (req, res, next) => {
    if (!req.params?.id)
      return res.jsonBadRequestError("Params {id} not present");
    next();
  },
  requireParamsSlug: async (req, res, next) => {
    if (!req.params?.slug)
      return res.jsonBadRequestError("Params {slug} not present");
    next();
  },
  
  validation: brandValidation,

  
  checkExistOrCreateImageDir: async (req, res, next) => {
    try {
      if (!fs.existsSync(tempUploadDir)) {
        fs.mkdirSync(tempUploadDir);
      }
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }
    } catch (err) {
      console.error(err);
    }
    next();
  },

  uploadImage: uploadImage,

  fixImageUrl: async (req, res, next) => {
    if (req.files?.length > 0) {
      const images = req.files.map(function (file, i) {
        file.url = `${file.destination}${file.filename}`.replace(
          /^public\//,
          ""
        );
        return file;
      });
      req.files = images;
    }
    next();
  },
};

module.exports = brandMiddleware;
