var universeService = require('./services/universeService');

exports.create = function(req, res, next) {
	var newUniverse = req.body;
	universeService.create(newUniverse)
		.then(function(createRes) {
			res.status(201)
				.json({});
		})
}