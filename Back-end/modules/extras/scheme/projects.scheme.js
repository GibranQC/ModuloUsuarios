var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectModel = new Schema({
	stateId 	: { type : String, trim : true },
	prefix		: { type : String, trim : true, uppercase : true },
	state		: { type : String, trim : true }
});

module.exports = mongoose.model('Project', ProjectModel);