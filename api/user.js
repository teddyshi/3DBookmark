var userService = require('./services/userService');

exports.create = function(req, res, next) {
	var newUser = req.body;
	userService.create(newUser)
		.then(function(createRes) {
			res.status(201)
				.json({});
		})
}