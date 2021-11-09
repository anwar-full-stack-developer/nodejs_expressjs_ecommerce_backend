const niv = require("node-input-validator");
const mongoose = require("mongoose");
const Brand = require("../models/Brand");

//custom rules
niv.extend("isBrandExist", async ({ value }) => {
  try {
    const b = await Brand.findById(
      new mongoose.Types.ObjectId(value.trim())
    ).exec();
    if (b) {
      return true;
    }
  } catch (error) {
    console.log("validation error isBrandExist", error);
  }

  console.log("brand not exist");
  return false;
});

const brandValidation = {
  create: async function (req, res, next) {
    const v = new niv.Validator(req.body, {
      name: ["required", "string", "minLength:3"],
    });

    const isValid = await v.check();
    if (!isValid) {
      console.log(v.errors);
      return res.jsonValidationError({ error: v.errors });
    }
    next();
  },

  delete: async function (req, res, next) {
    console.log(req.params?.id);
    const v = new niv.Validator(
      { id: req.params?.id },
      {
        id: ["required", "string", "isBrandExist"],
      },
      {
        "id.isBrandExist": "Brand with {:value} not found"
      }
    );

    const isValid = await v.check();
    if (!isValid) {
      console.log(v.errors);
      return res.jsonValidationError({ error: v.errors });
    }
    next();
  },
};

module.exports = brandValidation;
