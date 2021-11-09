const path = require("path");
const fs = require("fs");
const {PRODUCT_UPLOAD_DIR, PRODUCT_UPLOAD_DIR_TEMP} = require("./../constants/product.constant");

const uploadDir = PRODUCT_UPLOAD_DIR;

const productHelper = {
  moveProductImages: async function (req, res) {
    const productId = req.productId;

    const toDir = path.resolve(`${uploadDir}${productId}`);
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
          destination: `${uploadDir}${productId}/`,
          path: `${uploadDir}${productId}/${file.filename}`,
          url: `${uploadDir}${productId}/${file.filename}`.replace(
            /^public\//,
            ""
          ),
        };
      });
      req.files = images;
    }
    return;
  },

  removeProductImages: async function (req, res) {
    const productId = req.productId;
    const toDir = path.resolve(`${uploadDir}${productId}`);
    if (fs.existsSync(toDir)) {
      await fs.rmdir(toDir, { recursive: true, force: true }, function (err) {
          console.log(err);
      });
    }
    return;
  },
};

module.exports = productHelper;
