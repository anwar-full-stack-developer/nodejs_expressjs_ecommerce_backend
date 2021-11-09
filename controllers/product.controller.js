const Product = require("./../models/Product");
const productHelper = require("./../helpers/product.helper");
const mongoose = require("mongoose");

/**
 * CRUD, SEARCH, ALL, AllProductByUser, READBYSLUG operation for HTTP request endpoints. Allowed methods GET, POST, PUT, DELETE.
 * @module ProductController
 * @api ProductController
 */
const ProductController = {
  /**
   * Search product by search criteria, query params including product {title} {slug}
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
      const product = await Product.find(searchQuery).exec();
      return res.jsonOK({ result: product });
    } catch (err) {
      return res.jsonInternalServerError({ error: err });
    }
  },

  /**
   * All product
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
      let searchQuery = {};
      const product = await Product.find(searchQuery).exec();
      return res.jsonOK({ result: product });
    } catch (err) {
      return res.jsonInternalServerError({ error: err });
    }
  },
  /**
   * Get all products for loggedin user id
   * @name allProductsByUser
   * @async
   * @function
   * @method GET
   * @param {Object} req - HTTP request object
   * @param {String} req.header.authorization - User login token
   * @param {Object} res - HTTP response object
   * @param {Function} next - Callback function to dispatch next route
   * @callback next
   * @returns {Object} success response JSON Object
   * @returns {Object} error response JSON Object
   */
  allProductsByUser: async function (req, res, next) {
    const loggedinUser = req?.loggedinUser;
    try {
      const product = await Product.find({ owner: loggedinUser.id }).exec();
      return res.jsonOK({ result: product });
    } catch (err) {
      return res.jsonInternalServerError({ error: err });
    }
  },
  /**
   * Create new product
   * @name create
   * @async
   * @function
   * @method POST
   * @param {Object} req - HTTP request object
   * @param {String} req.header.authorization - User login token
   * @param {String} req.body.title - product title
   * @param {String} req.body.description - product details
   * @param {String} req.body.stock - number of stock available to sell
   * @param {Array} req.body.images - allow multiple images as product pictures
   * @param {Object} res - HTTP response object
   * @param {Function} next - Callback function to dispatch next route
   * @callback next
   * @returns {Object} success response JSON Object with created entry
   * @returns {Object} error response JSON Object
   */
  create: async function (req, res, next) {
    const loggedinUser = req?.loggedinUser;
    try {
      let product = new Product();
      product.set({
        // ...product._doc,
        ...req.body,
        owner: loggedinUser.id,
        created: Date.now(),
        stock: parseInt(req.body.stock),
      });
      await product.save();

      //move uploaded images to product id dir
      req.productId = product.id;
      if (req.files?.length > 0) {
        await productHelper.moveProductImages(req, res);
        product.images = req.files;
        await product.save();
      }
      return res.jsonCreated({
        result: product,
        message: "Product has been created",
      });
    } catch (err) {
      return res.jsonInternalServerError({ error: err });
    }
  },
  /**
   * Get single product with details
   * @name read
   * @async
   * @function
   * @method GET
   * @param {Object} req - HTTP request object
   * @param {String} req.params.id - Product id
   * @param {Object} res - HTTP response object
   * @param {Function} next - Callback function to dispatch next route
   * @callback next
   * @returns {Object} success response JSON Object
   * @returns {Object} error response JSON Object
   */
  read: async function (req, res, next) {
    try {
      const product = await Product.findById(req.params?.id).exec();
      return !product
        ? res.jsonNotFoundError(`Product with id: ${req.params?.id} not found.`)
        : res.jsonOK({ result: product });
    } catch (err) {
      return res.jsonInternalServerError({ error: err });
    }
  },
  /**
   * Get single product by slug parameter
   * @name readBySlug
   * @async
   * @function
   * @method POST
   * @param {Object} req - HTTP request object
   * @param {String} req.params.slug - product slug
   * @param {Object} res - HTTP response object
   * @param {Function} next - Callback function to dispatch next route
   * @callback next
   * @returns {Object} success response JSON Object
   * @returns {Object} error response JSON Object
   */
  readBySlug: async function (req, res, next) {
    try {
      const product = await Product.findOne({ slug: req.params?.slug }).exec();
      return !product
        ? res.jsonNotFoundError(
            `Product with slug: ${req.params?.slug} not found.`
          )
        : res.jsonOK({ result: product });
    } catch (err) {
      return res.jsonInternalServerError({ error: err });
    }
  },

  /**
   * Update product, or partial update product
   * @name update
   * @async
   * @function
   * @method POST
   * @param {Object} req - HTTP request object
   * @param {String} req.header.authorization - User login token
   * @param {String} req.body.title - product title
   * @param {String} req.body.description - product details
   * @param {String} req.body.stock - number of stock available to sell
   * @param {Array} req.body.images - allow multiple images as product pictures
   * @param {Object} res - HTTP response object
   * @param {Function} next - Callback function to dispatch next route
   * @callback next
   * @returns {Object} success response JSON Object with created entry
   * @returns {Object} error response JSON Object
   */
  update: async function (req, res, next) {
    const loggedinUser = req?.loggedinUser;
    try {
      const product = await Product.findOne({
        _id: mongoose.Types.ObjectId(req.params?.id),
        owner: mongoose.Types.ObjectId(loggedinUser?.id),
      }).exec();
      if (!product)
        return res.jsonNotFoundError(
          `Product with id: ${req.params?.id} not found.`
        );

      product.set({
        ...req.body,
      });
      if (req.body.stock) product.stock = parseInt(req.body.stock);
      product.update();

      //move uploaded images to product id dir
      req.productId = product.id;
      if (req.files?.length > 0) {
        await productHelper.moveProductImages(req, res);
        product.images = { ...product.images, ...req.files };
        await product.save();
      }

      return res.jsonUpdated({ result: product });
    } catch (err) {
      return res.jsonInternalServerError({ error: err });
    }
  },
  /**
   * Delete product with upload images.
   * @name delete
   * @async
   * @function
   * @method DELETE
   * @param {Object} req - HTTP request object
   * @param {String} req.header.authorization - User login token
   * @param {String} req.params.id - product id
   * @param {Object} res - HTTP response object
   * @param {Function} next - Callback function to dispatch next route
   * @callback next
   * @returns {Object} success or error response JSON Object for creating entry
   */
  delete: async function (req, res, next) {
    const loggedinUser = req?.loggedinUser;
    try {
      const product = await Product.findOne({
        _id: mongoose.Types.ObjectId(req.params?.id),
        owner: mongoose.Types.ObjectId(loggedinUser?.id),
      }).exec();
      if (!product)
        return res.jsonNotFoundError(
          `Product with id: ${req.params?.id} not found.`
        );
      //remove images file and folder
      req.productId = product.id;
      await productHelper.removeProductImages(req, res);
      await product.remove();
      return res.jsonDeleted({
        message: "Product has been deleted.",
      });
    } catch (err) {
      return res.jsonInternalServerError({ error: err });
    }
  },
};
/**
 * @module ProductController
 */
module.exports = ProductController;
