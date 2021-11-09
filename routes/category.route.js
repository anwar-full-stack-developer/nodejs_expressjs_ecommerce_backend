const express = require("express");
const basicAuthentication = require('../middlewares/basic-authentication.middleware');
const CategoryController = require("../controllers/category.controller");
const router = express.Router();

//do maintain route sequence
//all
router.route("/search").get(CategoryController.search);

router.route("/byslug/:slug").get(CategoryController.readBySlug);

router.route("/").get(CategoryController.all);

router.route("/").post([basicAuthentication.requireLoginAsAdmin, CategoryController.create]);

router.route("/:id").get(CategoryController.read);

router.route("/:id").put([basicAuthentication.requireLoginAsAdmin, CategoryController.update]);

router.route("/:id").delete([basicAuthentication.requireLoginAsAdmin, CategoryController.delete]);

module.exports = router;
