var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var specialityScheme = new Schema({    
    name 	          :{type: String, require: true, trim: true, uppercase: true}, // ** Nombre de la categoria**/
});
module.exports = mongoose.model('Specialities', specialityScheme);