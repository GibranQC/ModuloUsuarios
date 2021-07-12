
var UsersScheme = require('../users/users.scheme');

var ProfilesModel = require('../profiles/profiles.scheme');


module.exports.listUsers = listUsers;
module.exports.listProfiles = listProfiles;


function listUsers(object, callback) {
  var stages = [];
  stages.push({
    $match: {
      active: true
    }
  });
  stages.push({
    $project: {
      _id: 1,
      fullname: 1
    }
  });
  stages.push({
    $sort: {
      "fullname": 1
    }
  })
  UsersScheme
    .aggregate(stages)
    .exec(function (err, response) {
      if (err) {
        err.status_code = 500
        return callback(err);
      }
      object.data = response;
      return callback(null, object);
    });
}

function listProfiles(object, callback) {
  ProfilesModel.find({}, {
      _id: 1,
      name: 1
    })
    .exec(function (err, response) {
      if (err) {
        return callback(err, null)
      }
      if (response.length == 0) {
        callback(null, {
          data: []
        });
      } else {
        object.data = response
        callback(null, object)
      }
    });
}

