const User = require("./../models/User");
const userHelper = require("./../helpers/user.helper");

const UserController = {
  read: async function (req, res, next) {
    try {
      const user = await User.findById(req.loggedinUser?.id).exec();
      return !user
        ? res.jsonNotFoundError(`User not found.`)
        : res.jsonOK({ result: user });
    } catch (err) {
      return res.jsonInternalServerError({ error: err });
    }
  },
  update: async (req, res, next) => {
    const valueToUpdate = await userHelper.getAllowedValuesToUpdate({
      ...req.body,
    });
    if (valueToUpdate.length == 0) {
      return res.jsonValidationError({ error: "Nothing to update" });
    }
    try {
      const user = await User.findById(req.loggedinUser?.id).exec();
      if (!user) return res.jsonNotFoundError(`User not found.`);
      // const fields = []; //fields only allowed to update
      if (valueToUpdate.length > 0) {
        user.set({ ...valueToUpdate });
        await user.save();
      }
      return res.jsonUpdated({
        result: user,
        message: "User information has been updated.",
      });
    } catch (err) {
      return res.jsonInternalServerError({ error: err });
    }
  },
  uploadProfilePicture: async function (req, res, next) {
    try {
      const user = await User.findById(req.loggedinUser?.id).exec();
      if (!user) return res.jsonNotFoundError(`User not found.`);
      if (req.files.length == 0)
        return res.jsonOK({
          result: user,
          message: "Nothing to update",
        });

      //move uploaded images to brand id dir
      req.userId = user.id;
      //remove previous uploaded image here before move new image
      await userHelper.removeProfilePicture(req, res, next, user); //remove old logo
      await userHelper.moveMoveProfilePicture(req, res, next, user);
      user.profile_picture = req.files;
      await user.save();
      return res.jsonUpdated({
        result: user,
        message: "Profile picture has been updated",
      });
    } catch (err) {
      return res.jsonInternalServerError({ error: err });
    }
  },
};
module.exports = UserController;
