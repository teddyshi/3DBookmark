var galaxyService = require('../services/galaxyService');

exports.create = function(req, res, next) {
	var newGalaxy = req.body;
	galaxyService.create(newGalaxy)
		.then(function(createRes) {
			res.status(201)
				.json({});
		});
}