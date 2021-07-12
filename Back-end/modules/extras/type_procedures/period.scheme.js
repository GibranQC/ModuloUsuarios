var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var periodScheme = new Schema({    
    name 	          :{type: String, require: true, trim: true, uppercase: true}, // ** Nombre de la categoria**/
    days: Number
});
module.exports = mongoose.model('Periods', periodScheme);