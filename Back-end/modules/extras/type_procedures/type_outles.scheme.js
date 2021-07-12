var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var typeOutlets = new Schema({    
    name 	          :{type: String, require: true, trim: true, uppercase: true}, // ** Nombre de la categoria**/
    description 	  :{type: String, require: true, trim: true, uppercase: true}, // ** Descripción de la categoria **/
});



module.exports = mongoose.model('type_outlets', typeOutlets);

