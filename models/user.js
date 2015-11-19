var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
	sex: Number,
	mail: String,
	nickname:String
});

module.exports = mongoose.model('User',userSchema);