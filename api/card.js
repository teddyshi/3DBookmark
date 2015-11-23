var cardService = require('../services/cardService');

exports.create = function(req, res, next) {
	var newCard = req.body;
	cardService.create(newGalaxy)
		.then(function(createRes) {
			res.status(201)
				.json({});
		});
}

exports.update = function(req, res, next) {
	var updatedCard = req.body;
	cardService.create(updatedCard)
		.then(function(updateRes) {
			res.status(200)
				.json({});
		});
}
