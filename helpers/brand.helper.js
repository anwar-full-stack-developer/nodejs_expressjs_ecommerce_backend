const path = require("path");
const fs = require("fs");
const {
  BRAND_UPLOAD_DIR,
  BRAND_UPLOAD_DIR_TEMP,
} = require("../constants/brand.constant");

const uploadDir = BRAND_UPLOAD_DIR;

const brandHelper = {
  moveImages: async function (req, res) {
    const brandId = req.brandId;

    const toDir = path.resolve(`${uploadDir}${brandId}`);
    if (!fs.existsSync(toDir)) {
      fs.mkdirSync(toDir);
    }

    if (req.files.length > 0) {
      const images = req.files.map(function (file, i) {
        let oldPath = `${path.resolve(file.destination)}\\${file.filename}`;
        let newPath = `${toDir}\\${file.filename}`;
        fs.renameSync(oldPath, newPath);
        return {
          ...file,
          destination: `${uploadDir}${brandId}/`,
          path: `${uploadDir}${brandId}/${file.filename}`,
          url: `${uploadDir}${brandId}/${file.filename}`.replace(
            /^public\//,
            ""
          ),
        };
      });
      req.files = images;
    }
    return;
  },

  removeImages: async function (req, res) {
    const brandId = req.brandId;
    const toDir = path.resolve(`${uploadDir}${brandId}`);
    if (fs.existsSync(toDir)) {
      await fs.rmdir(toDir, { recursive: true, force: true }, function (err) {
        console.log(err);
      });
    }
    return;
  },
  removeLogo: async function (req, res, next, payload) {
    const brandId = payload.id;
    const logo = payload.logo || [];
    const toDir = path.resolve(`${uploadDir}${brandId}`);
    logo.map(function (file, i) {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      console.log(path.resolve(file.path));
    });
    return true;
  },
};

module.exports = brandHelper;
