var extrasCtrl = require('./extras.lib');
var usersCtrl = require('../users/users.lib')
var hospitalCtrl = require('../extras/hospitals/hospitals.lib');
var async = require('async')

module.exports.listUsers = listUsers;

module.exports.listProfiles = listProfiles;


function listUsers(req, res, next) {
  let data = {}
  extrasCtrl.listUsers(data, function (err, response) {
    if (err) {
      return res.status(400).send(err);
    } else {
      return res.status(200).send({
        data: response.data,
        success: true
      });
    }
  })
}



function listProfiles(req, res, next) {
  let data = {}
  extrasCtrl.listProfiles(data, function (err, response) {
    if (err) {
      return res.status(400).send(err);
    } else {
      return res.status(200).send({
        data: response.data,
        success: true
      });
    }
  })
}
