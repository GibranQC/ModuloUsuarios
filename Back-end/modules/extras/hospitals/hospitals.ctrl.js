var HospitalLib = require('./hospitals.lib')
var UserLibs = require('../../users/users.lib')
var async = require('async')

module.exports.list = list;
module.exports.save = save;
module.exports.listCtrl = listCtrl
module.exports.getById = getById;
module.exports.update = update;
module.exports.saveRooms = saveRooms;
module.exports.deleteHospital = deleteHospital;

function list(req, res) {
  var object = {
    params: mapParams(req.body),
    pager: mapPager(req.body.pager),
    results: {}
  };
  if(object.params.userId) object._id = { _id: object.params.userId}
  var process = [
    async.apply( UserLibs.getById , object),
    HospitalLib.count,
    HospitalLib.list
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
  HospitalLib.save(data, function (err, response) {
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
  HospitalLib.getById(data, function (err, response) {
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
  HospitalLib.update(data, function (err, response) {
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
  // console.log(params, " dlkjfnksjdfhksdjf")
  var query = {};
  query["is_active"] = true
  if (params.clue) {
    query["clue"] = new RegExp(params.clue, 'i');
  }
  if (params.name) {
    query['name'] = new RegExp(params.name, 'i');
  }
  if (params.institution) {
    if(params.institution._id != null) query["institution._id"] = params.institution._id
  }
  if (params.project) {
    if(params.project._id != null) query['project._id'] = params.project._id;
  }
  if (params.numberHospital) {
    if(params.numberHospital != null) query['numberHospital'] = params.numberHospital
  }
  if (params.userId) {
    query['userId'] = params.userId;
  }
  if(params.projectId)  {
    query['project._id'] = params.projectId;
  }
  if(params.projects){
      var projects = []
      params.projects.forEach(function (project) {
        projects.push(project._id)
      })
      query["project._id"] = {
        "$in": projects
      }
  }
  if(params.institutionId)query["institution._id"] = params.institutionId
  // console.log(query , " dlkfkdjsfskd")
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

function listCtrl(req, res, next){
  var object = {
    params: mapParams(req.body.filtering),
    pager: mapPager(req.body.pager),
    results: {}
  };
  if(object.params.userId) object._id = { _id: object.params.userId}
  var process = [
    async.apply( UserLibs.getById , object),
    HospitalLib.count,
    HospitalLib.listCtrl
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

function saveRooms(req, res, next) {
  var data = req.body
  HospitalLib.saveRooms(data, function (err, response) {
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

function deleteHospital(req, res, next) {
  var data =req.body
  HospitalLib.deleteHospital(data, function (err, response) {
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
