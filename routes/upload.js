var express = require('express');
var router = express.Router();
var uploadService = require('../service/uploadService')

router.post('/', uploadService.upload);

module.exports = router;

