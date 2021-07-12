var mongoose = require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose')
var Account = require('./../extras/scheme/accouts.scheme');
var Schema = mongoose.Schema;


var UserModel = new Schema({
  name       : { type : String, trim : true, uppercase : true },
  lastname   : { type : String, trim : true, uppercase : true },
  lastname2  : { type : String, trim : true, uppercase : true },
  fullname   : { type : String, trim : true, uppercase : true },
  status     : { type : Boolean, default : true },
  username    : { type : String, trim : true },
  email       : { type : String, trim : true },
  password    : { type : String, trim : true },
  profile     : {
    _id   : { type : String, trim : true },
    name  : { type : String, trim : true, uppercase : true }
  }
});

UserModel.pre('save', function (next) {
  var fullName = "";
  if (this.name != '') fullName += this.name;
  if (this.lastname != '') fullName += ' ' + this.lastname;
  if (this.lastname2 != '') fullName += ' ' + this.lastname2;
  this.fullname = fullName;
  //this.last_modified_date = new Date();
  //if (!this.created_by_user) this.created_by_user = this.modified_by_user;
  next();
});

//UserModel.plugin(passportLocalMongoose);

module.exports = mongoose.model('Users', UserModel);
