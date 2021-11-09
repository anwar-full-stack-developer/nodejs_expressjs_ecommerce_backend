const HttpStatusCodes = require("../constants/http-status-code.constant");
const brandHelper = require("./../helpers/brand.helper");
const Brand = require("../models/Brand");
const mongoose = require("mongoose");

/**
 * CRUD, SEARCH, ALL, READBYSLUG operation for HTTP request endpoints. Allowed methods GET, POST, PUT, DELETE.
 * @module BrandController
 * @api BrandController
 */
const BrandController = {
  /**
   * Search Brand by search criteria, query params including brand {name} {slug}
   * @name search
   * @async
   * @function
   * @method GET
   * @param {Object} req - HTTP request object
   * @param {Object} res - HTTP response object
   * @param {Function} next - Callback function to dispatch next route
   * @callback next
   * @returns {Object} success response JSON Object
   * @returns {Object} error response JSON Object
   */
  search: async function (req, res, next) {
    try {
      let searchQuery = {};
      const brand = await Brand.find(searchQuery).exec();
      res.jsonOK({ result: brand });
    } catch (err) {
      return res.jsonInternalServerError({ error: err });
    }
  },

  /**
   * All brands
   * @name all
   * @async
   * @function
   * @method GET
   * @param {Object} req - HTTP request object
   * @param {Object} res - HTTP response object
   * @param {Function} next - Callback function to dispatch next route
   * @callback next
   * @returns {Object} success response JSON Object
   * @returns {Object} error response JSON Object
   */
  all: async function (req, res, next) {
    try {
      const brand = await Brand.find({}).exec();
      return res.jsonOK({ result: brand });
    } catch (err) {
      return res.jsonInternalServerError({ error: err });
    }
  },

  /**
   * Create new brand
   * @name create
   * @async
   * @function
   * @method POST
   * @param {Object} req - HTTP request object
   * @param {String} req.body.name - name: brand name
   * @param {Array} req.body.logo - logo: file array containing object
   * @param {Object} res - HTTP response object
   * @param {Function} next - Callback function to dispatch next route
   * @callback next
   * @returns {Object} success response JSON Object with created entry
   * @returns {Object} error response JSON Object
   */
  create: async function (req, res, next) {
    try {
      const brand = new Brand();
      brand.set({
        ...req.body,
        created: Date.now(),
      });
      await brand.save();
      //move uploaded images to brand id dir
      req.brandId = brand.id;
      if (req.files?.length > 0) {
        await brandHelper.moveImages(req, res);
        brand.logo = req.files;
        await brand.save();
      }

      return res.jsonCreated({
        result: brand,
        message: "Brand has been created!",
      });
    } catch (err) {
      return res.jsonInternalServerError({
        error: err,
        message: "Failed to create Brand",
      });
    }
  },

  /**
   * Get single brand with details
   * @name read
   * @async
   * @function
   * @method GET
   * @param {Object} req - HTTP request object
   * @param {String} req.params.id - id: brand id
   * @param {Object} res - HTTP response object
   * @param {Function} next - Callback function to dispatch next route
   * @callback next
   * @returns {Object} success response JSON Object
   * @returns {Object} error response JSON Object
   */
  read: async function (req, res, next) {
    try {
      const brand = await Brand.findById(req.params?.id).exec();
      return !brand
        ? res.jsonNotFoundError(`Brand with id: ${req.params?.id} not found.`)
        : res.jsonOK({ result: brand });
    } catch (err) {
      return res.jsonInternalServerError({ error: err });
    }
  },

  /**
   * Get single brand by slug parameter
   * @name readBySlug
   * @async
   * @function
   * @method POST
   * @param {Object} req - HTTP request object
   * @param {String} req.params.slug - slug: brand slug
   * @param {Object} res - HTTP response object
   * @param {Function} next - Callback function to dispatch next route
   * @callback next
   * @returns {Object} success response JSON Object
   * @returns {Object} error response JSON Object
   */
  readBySlug: async function (req, res, next) {
    try {
      const brand = await Brand.findOne({ slug: req.params?.slug }).exec();
      return !brand
        ? res.jsonNotFoundError(
            `Brand with slug: ${req.params?.slug} not found.`
          )
        : res.jsonOK({ result: brand });
    } catch (err) {
      return res.jsonInternalServerError({ error: err });
    }
  },

  /**
   * Update existing brand entry by id as params
   * @name update
   * @async
   * @function
   * @method PUT
   * @param {Object} req - HTTP request object
   * @param {String} req.params.id - id: brand id (_id)
   * @param {Array} req.body.logo - logo: file array containing object
   * @param {Object} res - HTTP response object
   * @param {Function} next - Callback function to dispatch next route
   * @callback next
   * @returns {Object} success response JSON Object with created entry
   * @returns {Object} error response JSON Object
   */
  update: async function (req, res, next) {
    try {
      const brand = await Brand.findById(req.params?.id).exec();
      if (!brand)
        return res.jsonNotFoundError(
          `Brand with id: ${req.params?.id} not found.`
        );
      brand.set({ ...req.body });
      // await brand.updateOne();
      await brand.save();
      //move uploaded images to brand id dir
      req.brandId = brand.id;
      if (req.files?.length > 0) {
        //remove previous uploaded image here before move new image
        await brandHelper.removeLogo(req, res, next, brand); //remove old logo
        await brandHelper.moveImages(req, res);
        brand.logo = req.files;
        await brand.save();
      }
      return res.jsonUpdated({
        result: brand,
        message: "Brand has been updated.",
      });
    } catch (err) {
      return res.jsonInternalServerError({ error: err });
    }
  },

  /**
   * Delete brand with upload logo for brand.
   * @name delete
   * @async
   * @function
   * @method DELETE
   * @param {Object} req - HTTP request object
   * @param {String} req.params.id - id: brand id
   * @param {Object} res - HTTP response object
   * @param {Function} next - Callback function to dispatch next route
   * @callback next
   * @returns {Object} success response JSON Object with created entry
   * @returns {Object} error response JSON Object
   */
  delete: async function (req, res, next) {
    const { id } = req.params;
    try {
      // await Brand.findByIdAndRemove(req.params?.id);
      const brand = await Brand.findOne({
        _id: new mongoose.Types.ObjectId(id),
      }).exec();
      //remove images file and folder
      req.brandId = brand.id;
      await brandHelper.removeImages(req, res);
      await brand.remove();

      return res.jsonDeleted({ message: "Brand has been deleted." });
    } catch (err) {
      return res.jsonInternalServerError({ error: err });
    }
  },
};

/**
 * @module BrandController
 */
module.exports = BrandController;
