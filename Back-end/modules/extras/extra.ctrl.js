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
