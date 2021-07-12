var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProvidersModel = new Schema({
	name 	: { type : String, trim : true }
});

module.exports = mongoose.model('Providers', ProvidersModel);