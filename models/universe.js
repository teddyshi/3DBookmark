var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var universeSchema = new Schema({
	_id: ObjectId,
	name: String,
	ownerId: ObjectId,
	galaxies: [{
		_id: ObjectId,
		name: String,
		cards: [{
			_id: ObjectId,
			name: String,
			link: String,
			coordX: Number,
			coordY: Number,
			width: Number,
			height: Number,
			thickness: Number,
		}]
	}]
});

module.exports = mongoose.model('Universe',universeSchema);