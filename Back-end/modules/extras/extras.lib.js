var institutionsScheme = require('./institutions/institutions.scheme');
var sizesScheme = require('./sizes/sizes.scheme');
var countersScheme = require('./counters/counters.scheme');
var cie10Scheme = require('./cies/cie10.scheme')
var cie9Scheme = require('./cies/cie9.scheme')
var typeProceduresScheme = require('./type_procedures/type_procedures.scheme')
var projectsScheme = require('./projects/projects.scheme')
var assortmentScheme = require('./sizes/assortment.scheme');
var unitMeasurementScheme = require('./sizes/unitMeasurement.scheme');
var presentationScheme = require('./sizes/presentation.scheme');
var lotsScheme = require('./sizes/lots.scheme');
var supplieTypeScheme = require('./sizes/supplie_type.scheme');
var IncidencesScheme = require('./incidences/incidences.scheme');
var UsersScheme = require('../users/users.scheme');
var SuppliesScheme = require('../supplies/supplies.scheme');
var HospitalsScheme = require('./hospitals/hospitals.scheme');
var ProfilesModel = require('../profiles/profiles.scheme');
var RoomQxModel = require('./roomQx/roomqx.scheme')
var SpecialitiesModel = require('./type_procedures/speciality.scheme')
var PeriodsModel = require('./type_procedures/period.scheme')
var ProvidersModel = require('./scheme/providers.scheme')
var typeOutletsScheme = require('./type_procedures/type_outles.scheme')
var PriorityScheme = require('./type_procedures/priority.scheme')
var GenericCatalogsScheme = require('./generic_catalogs/generic_catalogs.scheme')

module.exports.listInstitutions = listInstitutions;
module.exports.listSizes = listSizes;
module.exports.listCounters = listCounters;
module.exports.listCies10 = listCies10;
module.exports.countCie10 = countCie10;
module.exports.listCies9 = listCies9;
module.exports.listTypesProcedures = listTypesProcedures;
module.exports.listProjects = listProjects;
module.exports.listUnitsMeasurement = listUnitsMeasurement;
module.exports.listAssortments = listAssortments;
module.exports.listPresentations = listPresentations;
module.exports.listLotsBySupplie = listLotsBySupplie;
module.exports.listLots = listLots;
module.exports.listSupplieType = listSupplieType;
module.exports.getStockLotsBySupplies = getStockLotsBySupplies;
module.exports.listIncidences = listIncidences;
module.exports.listUsers = listUsers;
module.exports.listSupplies = listSupplies;
module.exports.countSupplies = countSupplies;
module.exports.listLotsBySupply = listLotsBySupply;
module.exports.listDoctors = listDoctors;
module.exports.listHospitals = listHospitals;
module.exports.listProfiles = listProfiles;
module.exports.listRoomQX = listRoomQX;
module.exports.listSpecialities = listSpecialities
module.exports.updateRooms = updateRooms;
module.exports.deleteRooms = deleteRooms;
module.exports.listPeriods = listPeriods;
module.exports.listProviders = listProviders;
module.exports.ListTypeOutles = ListTypeOutles;
module.exports.ListPriorities = ListPriorities;
module.exports.listDays = listDays;

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

function listSupplies(object, callback) {
  var query = object.params;
  var pager = object.pager;
  var stages = [];
  stages.push({
    $match: query
  });
  stages.push({
    $project: {
      _id: 1,
      description: {
        $concat: ["$key", " - ", "$name"]
      },
      projects:1,
      key: 1
    }
  });
  stages.push({
    $sort: {
      "key": 1
    }
  })
  stages.push({
    $skip: pager.limit * (pager.skip - 1)
  });
  stages.push({
    $limit: pager.limit
  });
  SuppliesScheme
    .aggregate(stages)
    .exec(function (err, response) {
      if (err) {
        err.status_code = 500
        return callback(err);
      }
      if(object.destination){
        var list = []
        response.forEach(element => {
          var check = false
          element.projects.forEach(projectSupplie => {
            if(projectSupplie._id == object.destination.project._id){
              check = true;
            }
          });
          if(check == true){
            list.push(element)
          }
        });
        response = list
      }
      object.results.data = response;
      return callback(null, object);
    });
}

function countSupplies(object, callback) {
  var query = object.params;
  var stages = [];

  stages.push({
    $match: query
  });

  stages.push({
    $count: 'count'
  });

  SuppliesScheme
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

function listLotsBySupply(params, callback) {
  var object = params;
  var aggregate_arr = [];
  aggregate_arr.push({
    '$match': {
      'supplieId': create_object_id(object.supplieId)
    }
  });

  aggregate_arr.push({
    '$unwind': '$hospitals'
  })

  aggregate_arr.push({
    '$match': {
      "hospitals.hospitalId": create_object_id(object.hospitalId)
    }
  })
  aggregate_arr.push({
    '$match': {
      "hospitals.stock": {$gt:0}
    }
  })

  aggregate_arr.push({
    '$project': {
      "_id": 1,
      "name": 1,
      "expiredDate": 1,
      "stock": "$hospitals.stock"
    }
  });
  lotsScheme
    .aggregate(aggregate_arr)
    .exec(function (err, response) {
      if (err) {
        err.status_code = 500
        return callback(err);
      }
      return callback(null, response);
    });
}

function listHospitals(object, callback) {
  if (object.user.hospitals.length > 0) {
    object.data = object.user.hospitals
    callback(null, object)
  } else {
    var query = {}
    var proyects = []
    object.user.proyects.forEach(function (proyect) {
      proyects.push(proyect._id)
    })
    query["proyect"] = {
      "$in": proyects
    }
    HospitalsScheme.find(query, {
        _id: 1,
        clue: 1,
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


function listInstitutions(object, callback) {
  institutionsScheme.find({}, {
      "_id": 1,
      "name": 1
    })
    .exec(function (err, response) {
      if (err) {
        return callback(err, null)
      }
      if (response.length == 0) {
        callback({
          msg: "Not found"
        }, null)
      } else {
        object.data = response
        callback(null, object)
      }
    });
}

function listSizes(object, callback) {
  sizesScheme
    .find()
    .sort({
      name: 1
    })
    .exec(function (err, response) {
      if (err) {
        return callback(err, null)
      }
      if (response.length == 0) {
        callback({
          msg: "Not found"
        }, null)
      } else {
        object.data = response
        callback(null, object)
      }
    });
}

function listCounters(object, callback) {
  countersScheme.find()
    .exec(function (err, response) {
      if (err) {
        return callback(err, null)
      }
      if (response.length == 0) {
        callback({
          msg: "Not found"
        }, null)
      } else {
        object.data = response
        callback(null, object)
      }
    });
}

function listCies10(object, callback) {
  var query = object.params;
  var pager = object.pager;
  var stages = [];
  stages.push({
    $match: query
  });
  stages.push({
    $project: {
      _id: 1,
      description: {
        $concat: ["$key_diagnostic", " - ", "$description"]
      },
      // gender: 1,
      // age_inf: 1,
      // program: 1,
      // active: 1,
    }
  });
  stages.push({
    $sort: {
      "key_diagnostic": 1
    }
  })
  stages.push({
    $skip: pager.limit * (pager.skip - 1)
  });
  stages.push({
    $limit: pager.limit
  });
  cie10Scheme
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

function countCie10(object, callback) {
  var query = object.params;
  var stages = [];

  stages.push({
    $match: query
  });

  stages.push({
    $count: 'count'
  });

  cie10Scheme
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

function listCies9(object, callback) {
  var query = object.params;
  var pager = object.pager;
  var stages = [];
  stages.push({
    $match: query
  });
  stages.push({
    $project: {
      _id: 1,
      description: {
        $concat: ["$key_diagnostic", " - ", "$description"]
      },
      // procedimiento_type: 1,
      // active: 1,
    }
  });
  stages.push({
    $sort: {
      "key_diagnostic": 1
    }
  })
  stages.push({
    $skip: pager.limit * (pager.skip - 1)
  });
  stages.push({
    $limit: pager.limit
  });
  cie9Scheme
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

function listTypesProcedures(object, callback) {
  var stages = [];
  stages.push({
    $project: {
      _id: 1,
      name: 1
    }
  });
  typeProceduresScheme.aggregate(stages)
    .exec(function (err, response) {
      if (err) {
        return callback(err, null)
      }
      if (response.length == 0) {
        callback({
          msg: "Not found"
        }, null)
      } else {
        object.data = response
        callback(null, object)
      }
    });
}

// function listDoctors(object, callback) {
//   var stages = [];
//   stages.push({
//     $match: object
//   });
//   stages.push({
//     $project: {
//       _id: 1,
//       fullname: 1
//     }
//   });
//   DoctorsScheme.aggregate(stages)
//     .exec(function (err, response) {
//       if (err) {
//         return callback(err, null)
//       }
//       if (response.length == 0) {
//         object.data = []
//         callback(null, object)
//       } else {
//         object.data = response
//         callback(null, object)
//       }
//     });
// }

function listDoctors(object, callback) {
  _id = object.hospitals
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
  })
  stages.push({
    $project: {
      "doctors": {
        "_id": 1,
        "fullname": 1
      }
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
        var list = []
        response[0].doctors.forEach(element => {
          list.push(element)
        });
        response = list
      }
      object.data = response
      return callback(null, object)
      // }
    });
}


function listProjects(object, callback) {
  projectsScheme.find({}, {
      _id: 1,
      state: 1
    })
    .exec(function (err, response) {
      if (err) {
        return callback(err, null)
      }
      if (response.length == 0) {
        callback({
          msg: "Not found"
        }, null)
      } else {
        object.data = response
        callback(null, object)
      }
    });
}

function listUnitsMeasurement(object, callback) {
  assortmentScheme
    .find()
    .sort({
      name: 1
    })
    .exec(function (err, response) {
      if (err) {
        return callback(err, null)
      }
      if (response.length == 0) {
        callback({
          msg: "Not found"
        }, null)
      } else {
        object.data = response
        callback(null, object)
      }
    });
}

function listAssortments(object, callback) {
  unitMeasurementScheme
    .find()
    .sort({
      name: 1
    })
    .exec(function (err, response) {
      if (err) {
        return callback(err, null)
      }
      if (response.length == 0) {
        callback({
          msg: "Not found"
        }, null)
      } else {
        object.data = response
        callback(null, object)
      }
    });
}

function listPresentations(object, callback) {
  presentationScheme
    .find({}, {}, {
      $sort: {
        name: 1
      }
    })
    .exec(function (err, response) {
      if (err) {
        return callback(err, null)
      }
      if (response.length == 0) {
        callback({
          msg: "Not found"
        }, null)
      } else {
        object.data = response
        callback(null, object)
      }
    });
}

function listLotsBySupplie(object, callback) {
  lotsScheme.find({
      id: {
        $in: object.lots
      }
    })
    .exec(function (err, response) {
      if (err) {
        return callback(err, null)
      }
      if (response.length == 0) {
        callback({
          msg: "Not found"
        }, null)
      } else {

        object.data = response;

        for (var i = 0; i < object.data.length; i++) {
          for (var j = 0; j < object.data[i].supplies.length; j++) {
            object.data[i].supplies = object.data[i].supplies.filter(item => item.key === object.key);
          }
        }

        callback(null, object)
      }
    });
}

function listLots(object, callback) {
  lotsScheme.find({}, {
    id: 1,
    name: 1
  }, function (err, response) {
    if (err) return callback(err);

    object.data = response;
    return callback(null, object);
  });
}

function listSupplieType(object, callback) {
  supplieTypeScheme.find({}, {
    id: 1,
    name: 1
  }, function (err, response) {
    if (err) return callback(err);

    object.data = response;
    return callback(null, object);
  });
}

function getStockLotsBySupplies(object, callback) {
  var aggregate_arr = [];
  aggregate_arr.push({
    '$match': {
      'supplies._id': create_object_id(object._id)
    }
  });

  aggregate_arr.push({
    '$unwind': '$supplies'
  })

  aggregate_arr.push({
    '$match': {
      "supplies._id": create_object_id(object._id)
    }
  })

  aggregate_arr.push({
    '$unwind': '$supplies.hospitals'
  })

  aggregate_arr.push({
    '$match': {
      "supplies.hospitals._id": create_object_id(object.hospitals[0])
    }
  })
  aggregate_arr.push({
    '$project': {
      "_id": 1,
      "name": 1,
      "assortment": "$assortment.name",
      "supplie_id": "$supplies._id",
      "key": "$supplies.key",
      "stock": "$supplies.hospitals.stock"
    }
  });
  lotsScheme
    .aggregate(aggregate_arr)
    .exec(function (err, response) {
      if (err) {
        err.status_code = 500
        return callback(err);
      }
      object.data = response;
      return callback(null, object);
    });
}

function listIncidences(object, callback) {
  IncidencesScheme.find({}, {
    _id: 1,
    name: 1
  }, function (err, response) {
    if (err) return callback(err);

    object.data = response;
    return callback(null, object);
  });
}

function listRoomQX(object, callback) {
  _id = object.hospitalId
  var stages = []
  stages.push({
    $match: {
      "_id": create_object_id(_id)
    }
  });
  stages.push({
    "$lookup": {
      "from": "rooms",
      "localField": "roomsQx._id",
      "foreignField": "_id",
      "as": "roomsQx"
    }
  })
  stages.push({
    $project: {
      "roomsQx": {
        "_id": 1,
        "name": 1
      }
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
        var list = []
        response[0].roomsQx.forEach(element => {
          list.push(element)
        });
        response = list
      }
      object.results = response
      return callback(null, object)
      // }
    });
}


function listSpecialities(object, callback) {
  SpecialitiesModel
    .find()
    .sort({
      name: 1
    })
    .exec(function (err, response) {
      if (err) {
        return callback(err, null)
      }
      object.results = response
      callback(null, object)
    });
}

function updateRooms(object, callback) {
  var _id = object._id
  var data = object
  RoomQxModel.findByIdAndUpdate(_id, data, function (err, response) {
    if (err) {
      err.status_code = 500
      callback(err, null)
    }
    if (!response) {
      err.status_code = 304
      err.message = "PATIENT_NOT_UPDATE"
      callback(err, null)
    } else {
      callback(null, response)
    }
  });
}

function deleteRooms(object, callback) {
  var _id = object._id

  RoomQxModel.remove({
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

function listPeriods(object, callback) {
  PeriodsModel
    .find()
    .exec(function (err, response) {
      if (err) {
        return callback(err, null)
      }
      object.results = response
      callback(null, object)
    });
}

function listProviders(object, callback) {
  ProvidersModel.find({}, {
      "_id": 1,
      "name": 1
    })
    .exec(function (err, response) {
      if (err) {
        return callback(err, null)
      }
      if (response.length == 0) {
        callback({
          msg: "Not found"
        }, null)
      } else {
        object.data = response
        callback(null, object)
      }
    });
}

function ListTypeOutles(object, callback) {
  typeOutletsScheme.find({}, {
    id: 1,
    name: 1
  }, function (err, response) {
    if (err) return callback(err);

    object.data = response;
    return callback(null, object);
  });
}

function ListPriorities(object, callback) {
  PriorityScheme.find({}, {
    id: 1,
    name: 1
  }, function (err, response) {
    if (err) return callback(err);

    object.data = response;
    return callback(null, object);
  });
}

function listDays(object, callback) {
  GenericCatalogsScheme.find({ 'type': 'days' }, {
    id: 1,
    name: 1
  }, function (err, response) {
    if (err) return callback(err);

    console.log('%%%%%%%%%%%%%%%%%%');
    console.log(response);
    object.data = response;
    return callback(null, object);
  });
}


function create_object_id(_id) {
  var mongoose = require('mongoose');
  return mongoose.Types.ObjectId(_id)
}