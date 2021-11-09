const Category = require("../models/Category");

/**
 * CRUD, SEARCH, ALL, READBYSLUG operation for HTTP request endpoints. Allowed methods GET, POST, PUT, DELETE.
 * @module CategoryController
 * @api CategoryController
 */
const CategoryController = {
  /**
   * Search categories by search criteria, query params including brand {name} {description} {isActive}
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
      const category = await Category.find({}).exec();
      return res.jsonOK({ result: category });
    } catch (err) {
      return res.jsonInternalServerError({ error: err });
    }
  },

  /**
   * All Categories
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
      const category = await Category.find({}).exec();
      return res.jsonOK({ result: category });
    } catch (err) {
      return res.jsonInternalServerError({ error: err });
    }
  },

  /**
   * Create new category
   * @name create
   * @async
   * @function
   * @method PUT
   * @param {Object} req - HTTP request object
   * @param {String} req.body.title - title: category title
   * @param {String} req.body.description - description: category detils
   * @param {Boolean} req.body.isActive - isActive: true, false, (Active or Inactive)
   * @param {Object} res - HTTP response object
   * @param {Function} next - Callback function to dispatch next route
   * @callback next
   * @returns {Object} success response JSON Object with created entry
   * @returns {Object} error response JSON Object
   */
  create: async function (req, res, next) {
    try {
      const { title, description, parent_category } = req.body;
      const category = new Category({ title, description, parent_category });
      category.created = Date.now();
      await category.save();
      return res.jsonCreated({
        result: category,
        message: "Category has been created!",
      });
    } catch (err) {
      return res.jsonInternalServerError({
        error: err,
        message: "Failed to create Brand",
      });
    }
  },

  /**
   * Get single entry
   * @name read
   * @async
   * @function
   * @method GET
   * @param {Object} req - HTTP request object
   * @param {String} req.params.id - id: category id
   * @param {Object} res - HTTP response object
   * @param {Function} next - Callback function to dispatch next route
   * @callback next
   * @returns {Object} success response JSON Object
   * @returns {Object} error response JSON Object
   */
  read: async function (req, res, next) {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .send({ error: "Data does not formatted properly" });
    }
    try {
      const category = await Category.findById(id).exec();
      return !category
        ? res.jsonNotFoundError(`Brand with id: ${req.params?.id} not found.`)
        : res.jsonOK({ result: category });
    } catch (err) {
      return res.jsonInternalServerError({ error: err });
    }
  },

  /**
   * Get single entry by slug parameter
   * @name readBySlug
   * @async
   * @function
   * @method POST
   * @param {Object} req - HTTP request object
   * @param {String} req.params.slug - slug: category slug
   * @param {Object} res - HTTP response object
   * @param {Function} next - Callback function to dispatch next route
   * @callback next
   * @returns {Object} success response JSON Object
   * @returns {Object} error response JSON Object
   */
  readBySlug: async function (req, res, next) {
    const { slug } = req.params;
    if (!slug) {
      return res
        .status(400)
        .send({ error: "Data does not formatted properly" });
    }
    try {
      const category = await Category.findOne({ slug }).exec();
      if (!category) {
        return res.status(401).json({
          error: {
            statusCode: 401,
            message: "Category does not exist",
          },
        });
      }
      return res.jsonOK({ result: category });
    } catch (err) {
      return res.jsonInternalServerError({ error: err });
    }
  },

  /**
   * Update existing category entry by id as params
   * @name update
   * @async
   * @function
   * @method PUT
   * @param {Object} req - HTTP request object
   * @param {String} req.params.id - id: category id (_id)
   * @param {String} req.body.title - title: category title
   * @param {String} req.body.description - description: category detils
   * @param {Boolean} req.body.isActive - isActive: true, false, (Active or Inactive)
   * @param {Object} res - HTTP response object
   * @param {Function} next - Callback function to dispatch next route
   * @callback next
   * @returns {Object} success response JSON Object with created entry
   * @returns {Object} error response JSON Object
   */
  update: async function (req, res, next) {
    const { id } = req.params;
    const { title, description, isActive } = req.body;

    if (!id) {
      return res
        .status(400)
        .send({ error: "Data does not formatted properly" });
    }
    try {
      const category = await Category.findById(id).exec();
      if (!category) {
        return res.status(401).json({
          error: {
            statusCode: 401,
            message: "Category does not exist",
          },
        });
      }
      if (title) category.title = title;
      if (description) category.description = description;
      if (isActive) category.isActive = isActive;
      category.update();
      return res.jsonUpdated({
        result: brand,
        message: "Category has been updated.",
      });
    } catch (err) {
      return res.jsonInternalServerError({ error: err });
    }
  },

  /**
   * Delete category
   * @name delete
   * @async
   * @function
   * @method DELETE
   * @param {Object} req - HTTP request object
   * @param {String} req.params.id - id: category id
   * @param {Object} res - HTTP response object
   * @param {Function} next - Callback function to dispatch next route
   * @callback next
   * @returns {Object} success response JSON Object with created entry
   * @returns {Object} error response JSON Object
   */
  delete: async function (req, res, next) {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .send({ error: "Data does not formatted properly" });
    }
    try {
      const category = await Category.findById(id).exec();
      if (!category) {
        return res.status(401).json({
          error: {
            statusCode: 401,
            message: "Category does not exist",
          },
        });
      }
      category.remove();
      return res.jsonDeleted({ message: "Category has been deleted." });
    } catch (err) {
      return res.jsonInternalServerError({ error: err });
    }
  },
};

/**
 * @module CategoryController
 */
module.exports = CategoryController;
