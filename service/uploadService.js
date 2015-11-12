var fs = require('fs');

var _upload = function (req,res) {
	console.log('=====>'+req.toString());
	// fs.readFile(req.files.displayImage.path, function (err, data) {
	// 	var suffixArr = req.files.displayImage.type.split('/');
	// 	if(suffixArr.length<2){
	// 		console.err('wrong type of file.');
	// 		return;
	// 	}
	console.log('fs===>'+fs.rename);
	fs.rename(
		req.files.displayImage.path,
		__dirname+'/public/images/' +req.files.displayImage.name,
		function(error) {
			if(error) {
				res.send({
					error: 'Ah crap! Something bad happened'
				});
				return;
			}
			res.status(201).json('{"a":"uploaded....."}');
		}
    );
};

var guid = function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
};


module.exports = {
  upload: _upload
};