const express = require('express');
const router = express.Router();
const IndexController = require("./../controllers/index.controller");

/* GET home page. */
router.get('/', IndexController.main);

module.exports = router;
