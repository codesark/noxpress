const express = require('express');
const accountController = require('../controllers/api/account');

const router = express.Router();

router.post('/signup', accountController.signUp);
router.post('/signin', accountController.signIn);
router.post('/signout', accountController.signOut);

module.exports = router;
