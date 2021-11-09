const niv = require("node-input-validator");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const User = require("../models/User");
const {
  USER_PROFILE_PICTURE_UPLOAD_DIR,
  USER_PROFILE_PICTURE_UPLOAD_DIR_TEMP,
} = require("./../constants/user.constant");

const {
  USER_TYPE_ALLOWED_FOR_REGISTRATION,
} = require("../constants/user.constant");

//custom rules
niv.extend("authIsValidUserType", ({ value }) => {
  const userType = USER_TYPE_ALLOWED_FOR_REGISTRATION;
  if (userType.includes(value)) {
    return true;
  }
  return false;
});

const tempUploadDir = path.resolve(USER_PROFILE_PICTURE_UPLOAD_DIR_TEMP);
const uploadDir = path.resolve(USER_PROFILE_PICTURE_UPLOAD_DIR);

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

const uploadProfilePicture = multer({
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

const userMiddleware = {
  validation: {
    update: async function (req, res, next) {
      const vRulesDef = {
        first_name: ["required", "string", "minLength:3"],
        user_type: ["required", "string", "authIsValidUserType"],
        last_name: ["required", "string"],
        phone_number: ["required", "string"],
        gender: ["required", "string"],
        city: ["required", "string"],
        country: ["required", "string"],
        street: ["required", "string"],
        dob: ["required", "string"],
      };

      let validationRules = {};
      Object.entries(vRulesDef).forEach(([field, validationRole]) => {
        if (req.body[field]) validationRules[field] = validationRole;
      });
      // console.log(validationRules);

      const v = new niv.Validator(
        { ...req.body },
        { ...validationRules },
        {
          "user_type.authIsValidUserType": "{:value} is invalid user type",
        }
      );

      const isValid = await v.check();
      if (!isValid) {
        // console.log(v.errors);
        return res.jsonValidationError({ error: v.errors });
      }
      next();
    },
  },

  checkExistOrCreateProfilePictureDir: async (req, res, next) => {
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

  uploadProfilePicture: uploadProfilePicture,

  fixProfilePictureUrl: async (req, res, next) => {
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

module.exports = userMiddleware;
