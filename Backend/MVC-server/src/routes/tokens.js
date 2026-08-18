// Tokens route
const express = require('express');
var router = express.Router();

const tokensController = require('../controllers/tokens');

router.post('/', tokensController.login);

module.exports = router;