const niv = require("node-input-validator");
const mongoose = require("mongoose");
const Product = require("../models/Product");

//custom rules
niv.extend("requireProductExist", async ({ value }) => {
  try {
    const b = await Product.findOne({
      _id: new mongoose.Types.ObjectId(value.trim()),
    }).exec();
    if (b) {
      return true;
    }
  } catch (error) {
    console.log("validation error requireProductExist", error);
  }
  return false;
});

//custom rules
niv.extend("requireProductSlugExist", async ({ value }) => {
  try {
    const b = await Product.findOne({
      slug: value.trim(),
    }).exec();
    if (b) {
      return true;
    }
  } catch (error) {
    console.log("validation error requireProductSlugExist", error);
  }
  return false;
});
const productValidation = {
  create: async function (req, res, next) {
    const v = new niv.Validator(
      { ...req.body, stock: req.body?.stock ? parseInt(req.body?.stock) : "" },
      {
        title: ["required", "minLength:3"],
        description: ["required", "minLength:3"],
        stock: ["required", "min:1"],
      }
    );

    const isValid = await v.check();
    if (!isValid) {
      console.log(v.errors);
      return res.jsonValidationError({ error: v.errors });
    }
    next();
  },

  readBySlug: async function (req, res, next) {
    console.log(req.params?.slug);
    const v = new niv.Validator(
      { slug: req.params?.slug },
      {
        slug: ["required", "string", "requireProductSlugExist"],
      },
      {
        "slug.requireProductSlugExist": "Product with {:value} not found",
      }
    );

    const isValid = await v.check();
    if (!isValid) {
      console.log(v.errors);
      return res.jsonValidationError({ error: v.errors });
    }
    next();
  },
  read: async function (req, res, next) {
    console.log(req.params?.id);
    const v = new niv.Validator(
      { id: req.params?.id },
      {
        id: ["required", "string", "requireProductExist"],
      },
      {
        "id.requireProductExist": "Product with {:value} not found",
      }
    );

    const isValid = await v.check();
    if (!isValid) {
      console.log(v.errors);
      return res.jsonValidationError({ error: v.errors });
    }
    next();
  },
  update: async function (req, res, next) {
    let validationRules = {};
    if (req.body?.title) validationRules.title = ["minLength:3"];
    if (req.body?.description) validationRules.description = ["minLength:3"];
    if (req.body?.stock) validationRules.stock = ["min:1"];

    const v = new niv.Validator(
      {
        ...req.body,
        stock: req.body?.stock ? parseInt(req.body?.stock) : "",
        id: req.params?.id,
      },
      {
        ...validationRules,
        id: ["required", "string", "requireProductExist"],
      },
      {
        "id.requireProductExist": "Product with {:value} not found",
      }
    );

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
        id: ["required", "string", "requireProductExist"],
      },
      {
        "id.requireProductExist": "Product with {:value} not found",
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

module.exports = productValidation;
