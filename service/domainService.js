var _saveCard = function (req,res,next) {
	//console.log('---->'+req.body.a);
	res.status(201).json('{"a":"save card"}');
};

module.exports = {
  saveCard: _saveCard
};