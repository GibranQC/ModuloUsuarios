var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RoomQXModel = new Schema({    
    name 	          :{type: String, require: true, trim: true, uppercase: true}, // ** Nombre de la categoria**/
    description 	  :{type: String, require: true, trim: true, uppercase: true}, // ** Descripción de la categoria **/
    hospitalId: { type: String }

});


RoomQXModel.pre('save', function(next) {
    if ((this.name=='' || this.name=='undefined')) next(err);
    else next();
});

module.exports = mongoose.model('Room', RoomQXModel);

