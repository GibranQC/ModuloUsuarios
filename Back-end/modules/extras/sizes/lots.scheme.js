var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HospitalModel = new Schema([{
	hospitalId 			: { type : Schema.Types.ObjectId,ref:'hospitals' },
	stock 			: { type : Number, default : 0 },
	transit :	 { type : Number, default : 0 }
}]);

var LotModel = new Schema({
	code: { type : String, trim : true, uppercase : true },
	supplieId: { type : Schema.Types.ObjectId ,ref:'supplies'},
	name 			: { type : String, trim : true, uppercase : true },
	expiredDate:{ type: Date},

	active 			: { type : Boolean, default : true },
	hospitals:[HospitalModel]
});

module.exports = mongoose.model('Lot', LotModel);