const path = require("path");
const fs = require("fs");
const {
  USER_PROFILE_PICTURE_UPLOAD_DIR,
  USER_PROFILE_PICTURE_UPLOAD_DIR_TEMP,
} = require("../constants/user.constant");

const uploadDir = USER_PROFILE_PICTURE_UPLOAD_DIR;


const userdHelper = {
  getAllowedValuesToUpdate: (payload) => {
    let valueToUpdate = {};
    const allowedFieldsToUpdate = [
      "first_name",
      "user_type",
      "last_name",
      "phone_number",
      "gender",
      "city",
      "country",
      "street",
      "dob",
    ];
    allowedFieldsToUpdate.map((field) => {
      if (payload[field]) valueToUpdate[field] = payload[field];
    });
    return valueToUpdate;
  },
  
  moveMoveProfilePicture: async (req, res, next, payload) => {
    const id = payload?.id;

    const toDir = path.resolve(`${uploadDir}${id}`);
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
          destination: `${uploadDir}${id}/`,
          path: `${uploadDir}${id}/${file.filename}`,
          url: `${uploadDir}${id}/${file.filename}`.replace(
            /^public\//,
            ""
          ),
        };
      });
      req.files = images;
    }
    return;
  },

  //remove old profile picture
  removeProfilePicture: async function (req, res, next, payload) {
    const id = payload.id;
    const profile_picture = payload?.profile_picture || [];
    const toDir = path.resolve(`${uploadDir}${id}`);
    profile_picture.map(function (file, i) {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      // console.log(path.resolve(file.path));
    });
    return true;
  },
};

module.exports = userdHelper;
