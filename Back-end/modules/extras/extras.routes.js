var ExtrasController = require('./extra.ctrl')
var md_auth_token = require('../../middlewares/auth.middleware');

module.exports = function (app, router) {
  router.route('/private/extras/list/institutions').get([md_auth_token.validateToken], ExtrasController.listInstitutions);
  router.route('/private/extras/list/sizes').get([md_auth_token.validateToken], ExtrasController.listSizes);
  router.route('/private/extras/list/counters').get([md_auth_token.validateToken], ExtrasController.listCounters);
  router.route('/private/extras/list/cie9').put([md_auth_token.validateToken], ExtrasController.listCies9);
  router.route('/private/extras/list/cie10').put([md_auth_token.validateToken], ExtrasController.listCies10);
  router.route('/private/extras/list/typesProcedures').get([md_auth_token.validateToken], ExtrasController.listTypesProcedures);
  router.route('/private/extras/list/assortments').get([md_auth_token.validateToken], ExtrasController.listAssortments);
  router.route('/private/extras/list/unitMeasurement').get([md_auth_token.validateToken], ExtrasController.listUnitsMeasurement);
  router.route('/private/extras/list/presentations').get([md_auth_token.validateToken], ExtrasController.listPresentations);
  router.route('/private/extras/list/lots-by-supplie').post([md_auth_token.validateToken], ExtrasController.listLotsBySupplie);
  router.route('/private/extras/list/projects').get([md_auth_token.validateToken], ExtrasController.listProjects);
  router.route('/private/extras/list/lots').get([md_auth_token.validateToken], ExtrasController.listLots);
  router.route('/private/extras/list/supplie-type').get([md_auth_token.validateToken], ExtrasController.listSupplieType);
  router.route('/private/extras/list/supplie-stock-lots').post([md_auth_token.validateToken], ExtrasController.getStockLotsBySupplies);
  router.route('/private/extras/list/incidences').get([md_auth_token.validateToken], ExtrasController.listIncidences);
  router.route('/private/extras/list/users').get([md_auth_token.validateToken], ExtrasController.listUsers);
  router.route('/private/extras/list/supplies').post([md_auth_token.validateToken], ExtrasController.listSupplies);
  router.route('/private/extras/list/lots').post([md_auth_token.validateToken], ExtrasController.listLotsBySupply);
  router.route('/private/extras/list/doctors/:hospitalId').get([md_auth_token.validateToken], ExtrasController.listDoctors);
  router.route('/private/extras/list/hospitals:id').get([md_auth_token.validateToken], ExtrasController.listHospitals);
  router.route('/private/extras/list/profiles').get([md_auth_token.validateToken], ExtrasController.listProfiles);
  router.route('/private/extras/list/roomqx/:hospitalId').get([md_auth_token.validateToken], ExtrasController.listRoomQX);
  router.route('/private/extras/list/specialities/').get([md_auth_token.validateToken], ExtrasController.listSpecialities);
  router.route('/private/extras/update/rooms/').post([md_auth_token.validateToken], ExtrasController.updateRooms);
  router.route('/private/extras/delete/rooms/:_id').get([md_auth_token.validateToken], ExtrasController.deleteRooms);
  router.route('/private/extras/list/periods/').get( ExtrasController.listPeriods);
  router.route('/private/extras/list/providers/').get( ExtrasController.listProviders);
  router.route('/private/extras/list/outlets-catalog/').get( ExtrasController.ListTypeOutles);
  router.route('/extras/list/priorities-catalog/').get( ExtrasController.ListPriorities);
  router.route('/private/extras/list/days/').get(ExtrasController.listDays); 
}