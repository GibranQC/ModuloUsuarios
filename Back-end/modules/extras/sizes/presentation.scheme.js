var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PresentationModel = new Schema({
	name 			: { type : String, trim : true },
	description		: { type : String, trim : true }
});


module.exports = mongoose.model('Presentantion', PresentationModel);