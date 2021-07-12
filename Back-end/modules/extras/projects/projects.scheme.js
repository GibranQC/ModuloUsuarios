var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProyectsModel = new Schema({    
    stateId 	: { type : String, trim : true },
	prefix		: { type : String, trim : true, uppercase : true },
	state		: { type : String, trim : true }
});


ProyectsModel.pre('save', function(next) {
    if ((this.state=='' || this.state=='undefined')) next(err);
    else next();
});

module.exports = mongoose.model('Project', ProyectsModel);

