var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ModulesModel = new Schema({
	module		: { type : String, trim : true, uppercase : true },
	moduleId	: { type : Number, default: 0 },
	isSelected	: {	type : Boolean },
	privileges	: [{
		name 		: { type : String, trim: true },
		method 		: { type : String, trim: true },
		active		: { type : Boolean }
	}]
});

module.exports = mongoose.model('Modules', ModulesModel);