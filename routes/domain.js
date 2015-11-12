var express = require('express');
var router = express.Router();
var domainService = require('../service/domainService')

router.post('/', domainService.saveCard);

module.exports = router;

