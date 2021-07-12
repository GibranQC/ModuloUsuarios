var HospitalsScheme = require('./hospitals.scheme');
var RoomsScheme = require('../roomQx/roomqx.scheme');

module.exports.save = save;
module.exports.list = list;
module.exports.count = count;
module.exports.getById = getById;
module.exports.update = update;
module.exports.listCtrl = listCtrl;
module.exports.saveRooms = saveRooms;
module.exports.deleteHospital = deleteHospital;
module.exports.getProjectsHospital = getProjectsHospital
module.exports.getProjectsHospitalDestination = getProjectsHospitalDestination;

function save(object, callback) {
  let data = object
  var hospital = new HospitalsScheme(data);
  hospital.save(function (err, responseHospital) {
    if (err) {
      err.status_code = 500
      return callback(err);
    }
    object.response = responseHospital
    return callback(null, object.response)
  });
}

function list(object, callback) {
  if (object.user.hospitals.length == 1) {
    object.results.data = object.user.hospitals
    callback(null, object)
  } else {
    var query = object.params;
    var pager = object.pager;
    var stages = [];
    if (object.params.userId) delete object.params.userId
    // if (object.params.userId) {
    //   var query = {}
    //   var projects = []
    //   object.user.projects.forEach(function (proyect) {
    //     projects.push(proyect._id)
    //   })
    //   query["project._id"] = {
    //     "$in": projects
    //   }
    // }
    stages.push({
      $match: query
    });
    stages.push({
      $project: {
        _id: 1,
        clue: 1,
        name: 1,
        institution: 1,
        projects: 1,
        is_active: 1,
        numberHospital: 1
      }
    });
    stages.push({
      $sort: {
        "clue": 1
      }
    })
    stages.push({
      $skip: pager.limit * (pager.skip - 1)
    });
    stages.push({
      $limit: pager.limit
    });
    HospitalsScheme
      .aggregate(stages)
      .exec(function (err, response) {
        if (err) {
          err.status_code = 500
          return callback(err);
        }
        object.results.data = response;
        return callback(null, object);
      });
  }
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

  HospitalsScheme
    .aggregate(stages)
    .exec(function (err, response) {
      if (err) {
        err.status_code = 500
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
  _id = object._id
  var stages = []
  stages.push({
    $match: {
      "_id": create_object_id(_id)
    }
  });
  stages.push({
    "$lookup": {
      "from": "doctors",
      "localField": "doctors._id",
      "foreignField": "_id",
      "as": "doctors"
    }
  }, {
    "$lookup": {
      "from": "rooms",
      "localField": "roomsQx._id",
      "foreignField": "_id",
      "as": "roomsQx"
    }
  }, {
    "$lookup": {
      "from": "supplies",
      "localField": "stockControls._id",
      "foreignField": "_id",
      "as": "stockControlsList"
    }
  }, {
    "$lookup": {
      "from": "periods",
      "localField": "concentrated",
      "foreignField": "_id",
      "as": "concentrated"
    }
  })
  stages.push({
    $project: {
      "_id": 1,
      "clue": 1,
      "name": 1,
      "institution": 1,
      "project": 1,
      "is_active": 1,
      "numberHospital": 1,
      "doctors": {
        "_id": 1,
        "fullname": 1,
        "type": 1
      },
      "roomsQx": {
        "_id": 1,
        "name": 1
      },
      "stockControlsList": {
        "_id": 1,
        "key": 1,
        "type": 1,
        "name": 1
      },
      "stockControls": 1,
      "concentrated": {
        "_id": 1,
        "name": 1
      },
      "day": 1
    }
  });
  HospitalsScheme
    .aggregate(stages)
    .exec(function (err, response) {
      if (err) {
        err.status_code = 500
        return callback(null, object)
      }
      response.forEach(element => {
        element.stockControls.forEach(stock => {
          element.stockControlsList.forEach(stockCtrl => {
            if (stock._id.toString() == stockCtrl._id.toString()) {
              stockCtrl.minimum = stock.minimum
              stockCtrl.maximum = stock.maximum
              stockCtrl.latency = stock.latency
            }
          });
        });
        element.stockControls = element.stockControlsList
        delete element.stockControlsList
      });
      if (response.length > 0) {
        response = response[0]
        response.concentrated = response.concentrated[0]
      }
      object.hospital = response
      return callback(null, object.hospital)
      // }
    });
}

function update(object, callback) {
  var _id = object._id
  var data = object
  HospitalsScheme.findByIdAndUpdate(_id, data, function (err, response) {
    if (err) {
      err.status_code = 500
      callback(err, null)
    }
    if (!response) {
      err.status_code = 304
      err.message = "HOSPITAL_NOT_UPDATE"
      callback(err, null)
    } else {
      callback(null, response)
    }
  });
}

function listCtrl(object, callback) {
  var query = object.params;
  var pager = object.pager;
  var stages = [];
  if (object.params.userId) {
    var query = {}
    var projects = []
    object.user.projects.forEach(function (proyect) {
      projects.push(proyect._id)
    })
    query["project._id"] = {
      "$in": projects
    }
  }
  stages.push({
    $match: query
  });
  stages.push({
    $project: {
      "_id": 1,
      "clue": 1,
      "name": 1,
      "institution": 1,
      "project": 1,
      "numberHospital": 1
    }
  });
  stages.push({
    $sort: {
      "clue": 1
    }
  })
  stages.push({
    $skip: pager.limit * (pager.skip - 1)
  });
  stages.push({
    $limit: pager.limit
  });
  HospitalsScheme
    .aggregate(stages)
    .exec(function (err, response) {
      if (err) {
        err.status_code = 500
        return callback(err);
      }
      object.results.data = response;
      return callback(null, object);
    });
}

function saveRooms(object, callback) {
  let data = object
  var rooms = new RoomsScheme(data);
  rooms.save(function (err, response) {
    if (err) {
      err.status_code = 500
      return callback(err);
    }
    object.response = response
    var data = {
      _id: response._id
    }
    return callback(null, data)
  });
}

function create_object_id(_id) {
  var mongoose = require('mongoose');
  return mongoose.Types.ObjectId(_id)
}

function getProjectsHospital(object, callback) {
  if (object.hospitalId) {
    _id = object.hospitalId
    var stages = []
    stages.push({
      $match: {
        "_id": create_object_id(_id)
      }
    });

    stages.push({
      $project: {
        "_id": 1,
        "institution": 1,
        "project": 1,

      }
    });
    HospitalsScheme
      .aggregate(stages)
      .exec(function (err, response) {
        if (err) {
          err.status_code = 500
          return callback(null, object)
        }
        if (response.length > 0) {
          response = response[0]
            var data = []
            data.push(response.project._id)
            object.params["projects._id"] = {
              "$in": data
            }
        }
        return callback(null, object)
        // }
      });
  } else {
    return callback(null, object)
  }
}


function getProjectsHospitalDestination(object, callback) {
  if (object.destinationId) {
    _id = object.destinationId
    var stages = []
    stages.push({
      $match: {
        "_id": create_object_id(_id)
      }
    });

    stages.push({
      $project: {
        "_id": 1,
        "institution": 1,
        "project": 1,

      }
    });
    HospitalsScheme
      .aggregate(stages)
      .exec(function (err, response) {
        if (err) {
          err.status_code = 500
          return callback(null, object)
        }
        if (response.length > 0) {
          response = response[0]
          object.destination = response
          object.destination.destinationId = object.destinationId
        }
        return callback(null, object)
        // }
      });
  } else {
    return callback(null, object)
  }
}

function deleteHospital(object, callback) {
  var _id = object._id

  HospitalsScheme.remove({
    "_id": create_object_id(_id)
  }, function (err, response) {
    if (err) {
      err.status_code = 500
      callback(err, null)
    }
    if (!response) {
      err.status_code = 304
      err.message = "PATIENT_NOT_UPDATE"
      callback(err, null)
    } else {
      response = {
        delete: true
      }
      callback(null, response)
    }
  });
}