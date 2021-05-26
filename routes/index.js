const express = require('express');

const router = express.Router();

// ---------------------------------------------------------------

// import other route files here
const accountRoutes = require('./account');

// register imported routes from other files
router.use('/api/v1/account', accountRoutes);

// ---------------------------------------------------------------

// import controllers here
const homepageController = require('../controllers/homepage');
const errorController = require('../controllers/error');

// define routes here
router.get('/', homepageController.homepage);
router.use('/', errorController.notFound404); // catch if no route found

module.exports = router;
