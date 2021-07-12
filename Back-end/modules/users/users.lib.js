var UserScheme = require('./users.scheme');
var ProfileScheme = require('../profiles/profiles.scheme');
var passport = require('passport')
var AccountScheme = require('./../extras/scheme/accouts.scheme');
var jwt = require('../../utils/jwt');
const { use } = require('passport');
var app = {}

// passport.use(AccountScheme.createStrategy());
// passport.serializeUser(AccountScheme.serializeUser());
// passport.deserializeUser(AccountScheme.deserializeUser());

module.exports.login = login
module.exports.save = save;
module.exports.list = list;
module.exports.count = count;
module.exports.getById = getById;
module.exports.update = update;
module.exports.deleteUser = deleteUser;


function login(object, callback) {
  UserScheme.findOne({
    username: object.username,
    password: object.password,
    active: true
  }, function (err, user) {
    console.log(user, err)
    if (err)
      return callback(null, {
        success: false,
        message: 'Usuario o contraseña incorrectos.'
      });

    if (user) {

      ProfileScheme.findOne({
        _id: user.profile._id
      }, function (err, result) {
        if (err)
          return callback(null, {
            success: false,
            message: 'Ocurrio un problema al obtener los permisos del usuario.'
          });

        var finalUser = JSON.parse(JSON.stringify(user));
        if (result) {
          finalUser.permissions = result.permissions;
        }
        var token = jwt.createToken(finalUser);

        return callback(null, {
          success: true,
          user: finalUser,
          token: token
        });
      });
    } else {
      return callback(null, {
        success: false,
        message: 'Usuario o contraseña incorrectos.'
      });
    }
  });
}

function save(object, callback) {
  let data = object;
  data.email = data.username;

  UserScheme.find({
    "username": data.username,
    active: true
  }, function (err, response) {
    if (err)
      return callback(err, null);

    if (response.length > 0) {
      return callback(null, {
        message: "El nombre de usuario ya existe.",
        success: false
      })
    } else {

      var user = new UserScheme(data);

      user.save(function (err, newUser) {
        if (err) {
          return callback(null, {
            message: 'No se pudo crear el usuario.',
            success: false
          });
        }

        return callback(null, {
          success: true,
          message: 'El usuario se creo correctamente.'
        });
      });
    }
  });
}

function getProfileById(object, cb) {
  ProfileScheme.findOne({
    _id: object._id
  }, function (err, result) {
    if (err) {
      return cb(null, {
        success: false,
        data: {}
      })
    }

    return cb(null, result);
  });
}

function list(object, callback) {
  var query = object.params;
  var pager = object.pager;
  var stages = [];
  stages.push({
    $match: query
  });
  stages.push({
    $project: {
      password: 0
    }
  });
  stages.push({
    $sort: {
      fullname: 1
    }
  });
  stages.push({
    $skip: pager.limit * (pager.page - 1)
  });
  stages.push({
    $limit: pager.limit
  });
  UserScheme
    .aggregate(stages)
    .exec(function (err, response) {
      if (err) {
        return callback(err);
      }
      object.results.data = response;
      return callback(null, object);
    });
}

function count(object, callback) {
  var query = object.params;
  var stages = [];

  stages.push({
    $match: query
  });

  stages.push({
    $count: 'count'
  });

  UserScheme
    .aggregate(stages)
    .exec(function (err, response) {
      if (err) {
        return callback(err);
      }
      if (response.length > 0)
        object.results.count = response[0].count;
      else
        object.results.count = 0;
      return callback(null, object);
    });
}

function getById(object, callback) {
  if (object._id != undefined) {
    _id = object._id
    UserScheme.findById(_id, function (err, response) {
      if (err) {
        return callback(null, object)
      }
      if (response.length == 0) {
        object.user = response
        return callback({
          mng: "user not fount"
        }, null)
      } else {
        object.user = response
        return callback(null, object)
      }
    });
  } else {
    object.user = { hospitals :[]}
    return callback(null, object)
  }

}

function deleteUser(data, cb) {
  UserScheme.findByIdAndUpdate({
    _id: data._id
  }, {
    $set: {
      active: false
    }
  }, function (err, response) {
    if (err) return cb(err);

    return cb(null, response);
  });
}

// funciones especiales
function createAccount(username, password, user, sendEmail) {
  AccountScheme.register(new AccountScheme({
    username: username,
    user_id: user._id
  }), password.toString(), function (err, account) {
    if (err) {
      console.log(err);
    } else {
      console.log("Cuenta de usuario creada.");
    }
  });
};

function generatePassword(min, max) {
  min = 1000;
  max = 9999;
  return Math.floor(Math.random() * (max - min + 1) + min);
};

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function update(object, callback) {
  var _id = object._id;
  var data = object;
  data.fullname = data.name + ' ' + data.lastname + ' ' + data.lastname2;
  data.email = data.username;

  UserScheme.find({
    "username": data.username,
    active: true
  }, function (err, response) {
    if (err)
      return callback(err, null);

    if (response.length > 0 && response[0]._id != _id) {
      return callback(null, {
        message: "El nombre de usuario ya existe.",
        success: false
      })
    } else {
      UserScheme.findByIdAndUpdate(_id, data, function (err, response) {
        if (err) {
          callback(err, null)
        }
        if (!response) {
          callback(null, {
            success: false,
            message: 'No se pudo actualizar el usuario.'
          })
        } else {
          callback(null, {
            success: true,
            message: 'Usuario actualizado.'
          })
        }
      });
    }
  });
}

function resetPassword(object, callback) {
  AccountScheme.remove({
    user_id: object._id
  }, function (err, account) {
    if (err) {
      console.log(err);
    } else {
      Account.register(new Account({
        username: object.username,
        user_id: object._id
      }), object.password, function (err, account) {
        if (err) {
          console.log(err);
        } else {
          res.send(account);
        }
      });
    }
  });
}