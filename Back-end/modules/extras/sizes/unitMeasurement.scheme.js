var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UnitMeasurementModel = new Schema({
	name 			: { type : String, trim : true },
	description		: { type : String, trim : true }
});

module.exports = mongoose.model('Unit_Measurement', UnitMeasurementModel);