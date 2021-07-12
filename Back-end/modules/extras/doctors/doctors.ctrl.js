var DoctorsLib = require('./doctors.lib')
var async = require('async')

module.exports.list = list;
module.exports.save = save;
module.exports.getById = getById;
module.exports.update = update;
module.exports.deleteDoctor = deleteDoctor;

function list(req, res) {
  req.body.hospitalId = "5e6a7892dc4e52e4scdb02d25"
  var object = {
    params: mapParams(req.body),
    pager: mapPager(req.body.pager),
    results: {}
  };
  var process = [
    async.apply(DoctorsLib.count, object),
    DoctorsLib.list
  ];
  async.waterfall(process, callback)
  function callback(err, response) {
    if (err) {
      if (err.status_code) {
        return res.status(err.status_code).send()
      } else {
        return res.status(500).send()
      }
    }
    return res.status(201).send(response.results);
  }
}

function save(req, res, next) {
  var data = req.body
  // data.birthdate = new Date(req.body.birthdate)
  DoctorsLib.save(data, function (err, response) {
    if (err) {
      if (err.status_code) {
        return res.status(err.status_code).send()
      } else {
        return res.status(500).send()
      }
    } else {
      return res.status(200).send(response)
    }
  })
}

function getById(req, res, next) {
  var data = {
    _id: create_object_id(req.params._id)
  }
  DoctorsLib.getById(data, function (err, response) {
    if (err) {
      if (err.status_code) {
        return res.status(err.status_code).send()
      } else {
        return res.status(500).send()
      }
    } else {
      return res.status(200).send(response)
    }
  })
}

function update(req, res, next) {
  var data = req.body
  DoctorsLib.update(data, function (err, response) {
    if (err) {
      if (err.status_code) {
        return res.status(err.status_code).send()
      } else {
        return res.status(500).send()
      }
    } else {
      return res.status(200).send(response)
    }
  })
}

function deleteDoctor(req, res, next) {
  var data ={"_id": req.params._id}
  DoctorsLib.deleteDoctor(data, function (err, response) {
    if (err) {
      if (err.status_code) {
        return res.status(err.status_code).send()
      } else {
        return res.status(500).send()
      }
    } else {
      return res.status(200).send(response)
    }
  })
}

////// funtions extras
function mapParams(params) {
  var query = {};
  // query["is_active"] = true
  if (params.clue) {
    query["fullname"] = new RegExp(params.fullname, 'i');
  }
  if (params.name) {
    query['profesional_id'] = new RegExp(params.profesional_id, 'i');
  }
  if (params.hospitalId) {
    query['hospitals'] = params.hospitalId
  }
  return query;
}

function mapPager(params) {
  params = params || {};
  var pager = {
    limit: 100,
    skip: 1
  };
  if (params.skip) {
    pager.skip = params.skip;
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