var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var AssortmentModel = new Schema({
	name 			: { type : String, trim : true },
	description		: { type : String, trim : true }
});

module.exports = mongoose.model('Assortment', AssortmentModel);