var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SupplieTypeModel = new Schema({    
    name 	          : { type: String, require: true, trim: true, uppercase: true },
    description 	  : { type: String, require: true, trim: true, uppercase: true }
});


SupplieTypeModel.pre('save', function(next) {
    if ((this.name=='' || this.name=='undefined')) next(err);
    else next();
});

module.exports = mongoose.model('supplie_type', SupplieTypeModel);