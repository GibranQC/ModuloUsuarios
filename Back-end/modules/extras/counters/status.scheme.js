var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StatusModel = new Schema({
    name: { type: String, uppercase: true },                                            /**Código del hospital**/
    nombre: { type: String, uppercase: true },
    active: { type: Boolean, default: true },
    type:{type:String, trim: true, uppercase: true }
});


module.exports = mongoose.model('Status', StatusModel);

