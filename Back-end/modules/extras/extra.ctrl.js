var extrasCtrl = require('./extras.lib');
var usersCtrl = require('../users/users.lib')
var hospitalCtrl = require('../extras/hospitals/hospitals.lib');
var async = require('async')

module.exports.listInstitutions = listInstitutions;
module.exports.listSizes = listSizes;
module.exports.listCounters = listCounters;
module.exports.listCies10 = listCies10;
module.exports.listCies9 = listCies9;
module.exports.listTypesProcedures = listTypesProcedures;
module.exports.listProjects = listProjects;
module.exports.listUnitsMeasurement = listUnitsMeasurement;
module.exports.listAssortments = listAssortments;
module.exports.listPresentations = listPresentations;
module.exports.listLotsBySupplie = listLotsBySupplie;
module.exports.listLots = listLots;
module.exports.listSupplieType = listSupplieType;
module.exports.listGenericCatalog = listGenericCatalog;
module.exports.getStockLotsBySupplies = getStockLotsBySupplies;
module.exports.listIncidences = listIncidences;
module.exports.listUsers = listUsers;
module.exports.listSupplies = listSupplies;
module.exports.listLotsBySupply = listLotsBySupply;
module.exports.listDoctors = listDoctors;
module.exports.listHospitals = listHospitals;
module.exports.listProfiles = listProfiles;
module.exports.listRoomQX = listRoomQX;
module.exports.listSpecialities = listSpecialities;
module.exports.updateRooms = updateRooms;
module.exports.deleteRooms = deleteRooms;
module.exports.listPeriods = listPeriods;
module.exports.listProviders =listProviders;
module.exports.ListTypeOutles = ListTypeOutles;
module.exports.ListPriorities = ListPriorities;
module.exports.listDays = listDays;

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

function listDoctors(req, res){
  let data = {"hospitals":req.params.hospitalId}//"5e6a7892dc4e52e4scdb02d25"}
  extrasCtrl.listDoctors(data, function (err, response) {
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

function listSupplies(req, res, next) {
  var object = {
    params: mapParamsSupply(req.body),
    pager: mapPager(req.body.pager),
    hospitalId : req.body.hospialId,
    results: {}
  };
  if(req.body.destinationId){
    object.destinationId = req.body.destinationId
    var process = [
      async.apply(hospitalCtrl.getProjectsHospital , object),
      hospitalCtrl.getProjectsHospitalDestination,
      extrasCtrl.countSupplies,
      extrasCtrl.listSupplies
    ];
  }else{
    var process = [
      async.apply(hospitalCtrl.getProjectsHospital , object),
      extrasCtrl.countSupplies,
      extrasCtrl.listSupplies
    ];
  }

  async.waterfall(process, callback)
  function callback(err, response) {
    if (err) {
      if (err.status_code) {
        return res.status(err.status_code).send()
      } else {
        return res.status(500).send()
      }
    }
    return res.status(200).send(response.results);
  }
}

function listLotsBySupply(req, res){
  var data = req.body
  extrasCtrl.listLotsBySupply(data, function (err, response) {
    if (err) {
      return res.status(400).send(err);
    } else {
      return res.status(200).send({
        data: response
      });
    }
  })
}

function listInstitutions(req, res, next) {
  let data = {}
  extrasCtrl.listInstitutions(data, function (err, response) {
    if (err) {
      return res.status(400).send(err);
    } else {
      return res.status(200).send({
        response: response.data,
        success: true
      });
    }
  })
}

function listSizes(req, res, next) {
  let data = {}
  extrasCtrl.listSizes(data, function (err, response) {
    if (err) {
      return res.status(400).send(err);
    } else {
      return res.status(200).send({
        response: response.data,
        success: true
      });
    }
  })
}

function listCounters(req, res, next) {
  let data = {}
  extrasCtrl.listCounters(data, function (err, response) {
    if (err) {
      return res.status(400).send(err);
    } else {
      return res.status(200).send({
        response: response.data,
        success: true
      });
    }
  })
}

function listCies10(req, res) {
  var object = {
    params: mapParams(req.body),
    pager: mapPager(req.body.pager),
    results: {}
  };
  var process = [
    async.apply(extrasCtrl.countCie10, object),
    extrasCtrl.listCies10
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
    return res.status(200).send(response.results);
  }
}

function listCies9(req, res) {
  var object = {
    params: mapParams(req.body),
    pager: mapPager(req.body.pager),
    results: {}
  };
  var process = [
    async.apply(extrasCtrl.listCies9, object),
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
    return res.status(200).send(response.results);
  }
}

function mapParams(params) {
  var query = {};
  query["active"] = "1"
  // if (params.key_diagnostic) {
  //   query["key_diagnostic"] = new RegExp(params.key_diagnostic, 'i');
  // }
  if (params.description) {
    params.description = params.description.toUpperCase()
    query['$or'] = [{ 'key_diagnostic' : new RegExp(params.description, 'i') }, { 'description' : new RegExp(params.description, 'i') }];
  }

  if(params._id){
    query = { "_id": create_object_id(params._id) };
  }
  
  return query;
}

function mapParamsSupply(params) {
  var query = {};
  if (params.description) {
    query['$or'] = [{ 'key' : new RegExp(params.description, 'i') }, { 'name' : new RegExp(params.description, 'i') }];
  } 
  return query;
}

function mapPager(params) {
  params = params || {};
  var pager = {
    limit: 20,
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

function listSizes(req, res, next) {
  let data = {}
  extrasCtrl.listSizes(data, function (err, response) {
    if (err) {
      return res.status(400).send(err);
    } else {
      return res.status(200).send({
        response: response.data,
        success: true
      });
    }
  })
}

function listHospitals(req, res, next) {
  
  extrasCtrl.listHospitals(data, function (err, response) {
    if (err) {
      return res.status(400).send(err);
    } else {
      return res.status(200).send({
        data: response.data,
        success: true
      });
    }
  })
  let data = {_id: create_object_id(req.params._id)}
  var process = [
    async.apply(usersCtrl.getById  , object),
    extrasCtrl.listHospitals
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
    return res.status(200).send(response.results);
  }



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

function listProjects(req, res, next) {
  let data = {}
  extrasCtrl.listProjects(data, function (err, response) {
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

function listTypesProcedures(req, res, next) {
  let data = {}
  extrasCtrl.listTypesProcedures(data, function (err, response) {
    if (err) {
      return res.status(400).send(err);
    } else {
      return res.status(200).send({
        response: response.data,
        success: true
      });
    }
  })
}

function listUnitsMeasurement(req, res, next) {
  let data = {};

  extrasCtrl.listUnitsMeasurement(data, function (err, response) {
    if (err) {
      return res.status(400).send(err);
    } else {
      return res.status(200).send({
        response: response.data,
        success: true
      });
    }
  });
}

function listAssortments(req, res, next) {
  let data = {};

  extrasCtrl.listAssortments(data, function (err, response) {
    if (err) {
      return res.status(400).send(err);
    } else {
      return res.status(200).send({
        response: response.data,
        success: true
      });
    }
  });
}

function listPresentations(req, res, next) {
  let data = {};

  extrasCtrl.listPresentations(data, function (err, response) {
    if (err) {
      return res.status(400).send(err);
    } else {
      return res.status(201).send({
        response: response.data,
        success: true
      });
    }
  });
}

function listLotsBySupplie(req, res, next) {
  let data = {
    lots : [],
    hospitals : []
  };
  for (var i = 0; i < req.body.lots.length; i++) {
    data.lots.push(req.body.lots[i].id);
  }
  for(var j = 0; j < req.body.hospitals.length; j++) {
    data.hospitals.push(req.body.hospitals[j]._id);
  }

  data.key = req.body.key;

  extrasCtrl.listLotsBySupplie(data, function (err, response) {
    if (err) {
      return res.status(400).send(err);
    } else {
      return res.status(201).send({
        response: response.data,
        success: true
      });
    }
  });
}

function listLots(req, res, next) {
  let data = {};
  extrasCtrl.listLots(data, function (err, response) {
    if (err) {
      return res.status(400).send(err);
    } else {
      return res.status(201).send({
        response: response.data,
        success: true
      });
    }
  });
}

function listSupplieType(req, res, next) {
  let data = {};

  extrasCtrl.listSupplieType(data, function (err, response) {
    if (err) {
      return res.status(400).send(err);
    } else {
      return res.status(201).send({
        response: response.data,
        success: true
      });
    }
  });
}

function listGenericCatalog(req, res, next) {
  let data = {};

  extrasCtrl.listGenericCatalog(data, function (err, response) {
    if (err) {
      return res.status(400).send(err);
    } else {
      return res.status(201).send({
        response: response.data,
        success: true
      });
    }
  });
}

function getStockLotsBySupplies(req, res, next){
  let data = req.body
  extrasCtrl.getStockLotsBySupplies(data, function (err, response) {
    if (err) {
      return res.status(400).send(err);
    } else {
      return res.status(201).send({
        response: response.data,
        success: true
      });
    }
  });
}

function listIncidences(req, res, next) {
  let data = { }
  extrasCtrl.listIncidences(data, function (err, response) {
    if (err) {
      return res.status(400).send(err);
    } else {
      return res.status(200).send({
        response: response.data,
        success: true
      });
    }
  })
}

function listRoomQX(req, res, next) {
  let data = {"hospitalId":req.params.hospitalId}
  extrasCtrl.listRoomQX(data, function (err, response) {
    if (err) {
      return res.status(400).send(err);
    } else {
      return res.status(200).send({
        data: response.results,
        success: true
      });
    }
  })
}

function listSpecialities(req, res, next) {
  let data = {};

  extrasCtrl.listSpecialities(data, function (err, response) {
    if (err) {
      return res.status(400).send(err);
    } else {
      return res.status(201).send({
        response: response.results,
        success: true
      });
    }
  });
}

function updateRooms(req, res, next) {
  var data = req.body
  extrasCtrl.updateRooms(data, function (err, response) {
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

function deleteRooms(req, res, next) {
  var data ={"_id": req.params._id}
  extrasCtrl.deleteRooms(data, function (err, response) {
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

function listPeriods(req, res, next) {
  let data = {};
  extrasCtrl.listPeriods(data, function (err, response) {
    if (err) {
      return res.status(400).send(err);
    } else {
      return res.status(201).send({
        response: response.results,
        success: true
      });
    }
  });
}

function listProviders(req, res, next) {
  let data = {}
  extrasCtrl.listProviders(data, function (err, response) {
    if (err) {
      return res.status(400).send(err);
    } else {
      return res.status(200).send({
        response: response.data,
        success: true
      });
    }
  })
}

function ListTypeOutles(req, res, next) {
  let data = {}
  extrasCtrl.ListTypeOutles(data, function (err, response) {
    if (err) {
      return res.status(400).send(err);
    } else {
      return res.status(200).send({
        response: response.data,
        success: true
      });
    }
  })
}

function ListPriorities(req, res, next) {
  let data = {}
  extrasCtrl.ListPriorities(data, function (err, response) {
    if (err) {
      return res.status(400).send(err);
    } else {
      return res.status(200).send({
        response: response.data,
        success: true
      });
    }
  })
}

function listDays(req, res, next) {
  let data = {}
  extrasCtrl.listDays(data, function (err, response) {
    if (err) {
      return res.status(400).send(err);
    } else {
      return res.status(200).send({
        response: response.data,
        success: true
      });
    }
  })
}

function create_object_id(_id) {
  var mongoose = require('mongoose');
  return mongoose.Types.ObjectId(_id)
}