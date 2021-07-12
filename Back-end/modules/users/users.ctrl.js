var UsersLib = require('./users.lib')
var async = require('async')

module.exports.login = login
module.exports.list = list;
module.exports.save = save;
module.exports.getById = getById;
module.exports.update = update;
module.exports.deleteUser = deleteUser;


function login(req, res, next) {
  var data = req.body;
  UsersLib.login(data, function (err, response) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(response)
    }
  })
}

function list(req, res) {
  var object = {
    params: mapParams(req.body),
    pager: mapPager(req.body.pager),
    results: {}
  };
  var process = [
    async.apply(UsersLib.count, object),
    UsersLib.list
  ];
  async.waterfall(process, callback)
  function callback(err, response) {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(201).send(response.results);
  }
}

function save(req, res, next) {
  var data = req.body;

  UsersLib.save(data, function (err, response) {
    if (err) {
      console.log(err)
      res.status(500).send()
    } else {
      res.status(200).send(response)
    }
  })
}

function getById(req, res, next) {
  var data = {
    _id: create_object_id(req.params._id)
  }
  UsersLib.getById(data, function (err, response) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(200).send({response: response.user, success: true})
    }
  })
}

function update(req, res, next) {
  var data = req.body;
  UsersLib.update(data, function (err, response) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(200).send(response)
    }
  })
}

function deleteUser(req, res, next) {
  var data = req.body;
  UsersLib.deleteUser(data, function (err, response) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send({response: response, success : true});
    }
  });
}


function mapParams(params) {
  var query = {};
  if (params.filtering.username) {
    query['$or'] = [{ 'fullname' : new RegExp(params.filtering.username, 'i') }, { 'username' : new RegExp(params.filtering.username, 'i') }];
  }
  if (params.filtering.hospitals && params.filtering.hospitals.length > 0) {
    query['hospitals._id'] = { $in : params.filtering.hospitals };
  }
  if (params.filtering.profileId) {
    query['profile._id'] = params.filtering.profileId;
  }
  query['active'] = true;
  return query;
}

function mapPager(params) {
  params = params || {};
  var pager = {
    limit: 25,
    page: 1
  };
  if (params.page) {
    pager.page = params.page;
  }
  if (params.limit) {
    pager.limit = params.limit;
  }
  return pager;
}

function create_object_id(_id) {
  var mongoose = require('mongoose');
  return mongoose.Types.ObjectId(_id)
}