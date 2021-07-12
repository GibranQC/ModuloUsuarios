var ProfileCtrl = require('./profiles.ctrl')
var ProfileSchema = require('./profiles.scheme');
var md_auth_token = require('../../middlewares/auth.middleware');

module.exports = function (app, router) {
  router.route('/private/profiles/list').post([md_auth_token.validateToken], ProfileCtrl.getProfiles);
  router.route('/private/profiles/save').post([md_auth_token.validateToken], ProfileCtrl.saveProfile);
  router.route('/private/profiles/update').post([md_auth_token.validateToken], ProfileCtrl.updateProfile);

  router.route('/private/modules/list').get([md_auth_token.validateToken], ProfileCtrl.getModules);
}