var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SizesModel = new Schema({    
    name 	          :{type: String, require: true, trim: true, uppercase: true}, // ** Nombre de la categoria**/
    description 	  :{type: String, require: true, trim: true, uppercase: true}, // ** Descripción de la categoria **/
});


SizesModel.pre('save', function(next) {
    if ((this.name=='' || this.name=='undefined')) next(err);
    else next();
});

module.exports = mongoose.model('Sizes', SizesModel);

