var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var universeSchema = new mongoose.Schema({
	name: String,
	ownerId: ObjectId,
	galaxies: [{
		_id: ObjectId,
		name: String,
		cards: [{
			_id: ObjectId,
			title: String,
			link: String,
			coordX: Number,
			coordY: Number,
			width: Number,
			height: Number,
			thickness: Number
		}]
	}]
});

module.exports = mongoose.model('Universe',universeSchema);