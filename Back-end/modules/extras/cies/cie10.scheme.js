var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CIE10Model = new Schema({
  key_diagnostic: { type: String, uppercase: true },
  causes: {
    _id: { type: Schema.Types.ObjectId, ref: 'cause' },
    intervention: { type: String, uppercase: true },
    key: { type: String, uppercase: true },
    description: { type: String, uppercase: true },
  },
  description: { type: String, uppercase: true },
  gender: { type: String, uppercase: true },
  age_inf: { type: String, uppercase: true },
  program: { type: String, uppercase: true },
  active: { type: Boolean, default: true },
});


module.exports = mongoose.model('cie10', CIE10Model);
