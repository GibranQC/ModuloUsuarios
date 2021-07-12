var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CIE9Model = new Schema({
  key_diagnostic: { type: String, uppercase: true },
  causes: {
    _id: { type: Schema.Types.ObjectId, ref: 'cause' },
    intervention: { type: String, uppercase: true },
    key: { type: String, uppercase: true },
    description: { type: String, uppercase: true },
  },
  description: { type: String, uppercase: true },
  procedimiento_type: { type: String, uppercase: true },
  active: { type: Boolean, default: true },
});


module.exports = mongoose.model('cie9', CIE9Model);
