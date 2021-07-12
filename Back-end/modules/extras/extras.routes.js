var ExtrasController = require('./extra.ctrl')
var md_auth_token = require('../../middlewares/auth.middleware');

module.exports = function (app, router) {
  router.route('/private/extras/list/users').get([md_auth_token.validateToken], ExtrasController.listUsers);
  router.route('/private/extras/list/profiles').get([md_auth_token.validateToken], ExtrasController.listProfiles);
}