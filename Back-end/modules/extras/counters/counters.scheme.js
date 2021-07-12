var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CountersModel = new Schema({
    counter: { type: Number },                                               /**Código del hospital**/
    name: { type: String, uppercase: true },
    type: { type: String, uppercase: true }
});


module.exports = mongoose.model('Counters', CountersModel);