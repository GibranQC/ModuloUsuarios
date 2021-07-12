var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var generic_catalogs = new Schema({
  type: { type: String },
  name: { type: String, uppercase: true }
});

module.exports = mongoose.model('generic_catalogs', generic_catalogs);