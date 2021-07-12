var UserCtrl = require('./users.ctrl')
var UserSchema = require('./users.scheme');
var AccountSchema = require('./../extras/scheme/accouts.scheme');

var md_auth_token = require('../../middlewares/auth.middleware');
//Libs
//var passport = require("passport")
//passport.use(AccountSchema.createStrategy());
//passport.serializeUser(AccountSchema.serializeUser());
//passport.deserializeUser(AccountSchema.deserializeUser());

module.exports = function (app, router) {
  router.route('/private/login').post(UserCtrl.login)
  router.route('/private/users/save').post(UserCtrl.save);
  router.route('/private/users/list').put([md_auth_token.validateToken], UserCtrl.list);
  router.route('/private/users/byId/:_id').get([md_auth_token.validateToken], UserCtrl.getById);
  router.route('/private/users/update').post([md_auth_token.validateToken], UserCtrl.update);
  router.route('/private/users/delete').post([md_auth_token.validateToken], UserCtrl.deleteUser);
}
