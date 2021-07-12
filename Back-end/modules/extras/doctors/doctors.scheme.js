var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DoctorModel = new Schema({
  name: { type: String, require: true, trim: true, uppercase: true },/**Nombre(s) del doctor**/
  lastname: { type: String, default: '', trim: true, uppercase: true },	/**Apellido paterno**/
  lastname2: { type: String, default: '', trim: true, uppercase: true }, 	/**Apellido materno**/
  fullname: { type: String, uppercase: true },													/**Nombre completo**/
  gender: { type: String, enum: ['MALE', 'FEMALE'] },					/**Género**/
  birthdate: Date,														/**Fecha de nacimiento**/
  type: { _id: {type: String}, name:{type:String} },			/**Especialidad médica del doctor*/
  age			:Number, 													/**Edad**/
  hospitalId: { type: String },
  creationDate: { type: Date, default: Date.now() }
});


module.exports = mongoose.model('Doctor', DoctorModel);