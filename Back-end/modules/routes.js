var jwt = require('jsonwebtoken');
var cron = require('node-cron');
var CronJob = require('cron').CronJob
var expressJwt = require('express-jwt');
var UserRoute = require('./users/users.route');




module.exports = function(app, router) {
  UserRoute(app, router);
}
