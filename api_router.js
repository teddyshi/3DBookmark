var express = require('express');
var router = express.Router();
var user = require('./api/user.js');
var card = require('./api/card.js');
var galaxy = require('./api/galaxy.js');
var universe = require('./api/universe.js');

router.post('/user', user.create);
router.post('/card', post.create);
router.put('/card', post.update)
router.post('/galaxy', galaxy.create);
router.post('/universe', universe.create);

module.exports = router;