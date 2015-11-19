var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	_id: Schema.Types.ObjectId,
	sex: Number,
	mail: String,
	nickname:String
});

module.exports = mongoose.model('User',userSchema);