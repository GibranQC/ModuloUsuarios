var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var institutions = new Schema({
  name: { type: String, uppercase: true },
  description: { type: String, uppercase: true },
  active: { type: Boolean }
});

module.exports = mongoose.model('Institutions', institutions);