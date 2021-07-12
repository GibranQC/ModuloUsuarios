/*var UserSchema = require('../modules/users/users.scheme');
//Libs
var passport = require('passport');
var jwt = require('jsonwebtoken');

function doLogin(req, res, next) {
    return passport.authenticate('local', function(err, user, info) {
      var data = {
        err: err,
        user: user,
        info: info
      };
      if (data.user) {
        UserSchema.findById(data.user.user_id, function(err, user) {
          if (err) {
            next(err);
          }
          if (user) {
            data.token = jwt.sign(user.toJSON(), app.secret)
          }
          if (!user) {
              next(new Error("User not found"));
          }
          data.user = user;
          data.user.user_id = user._id;
          return res.status(200).send(data);
        });
      } else {
        return res.status(500).send({code: 500, msg:"Contraseña incorrecta"});
      }
    })(req, res, next);
}

module.exports = {
  doLogin: doLogin
}*/

(function(){
	'use strict';

	var jwt = require('jwt-simple');
	var moment = require('moment');
	var secret = 'CR@@n3st3s1@2020';

	exports.createToken = function(user){
		var payload = {
			sub: user._id,
			name: user.fullname,
			username: user.username,
			hospitals: user.hospitals,
			projects: user.projects,
			profile: user.profile,
			init: moment().unix(),
			exp: moment().add(1, 'days').unix()
		};

		return jwt.encode(payload, secret);
	};
})();
