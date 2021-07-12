var HospitalCtrl = require('./hospitals.ctrl')

module.exports = function (app, router) {
  router.route('/private/hospital/save').post(HospitalCtrl.save);
  router.route('/private/hospital/list').post(HospitalCtrl.list);
  router.route('/private/hospital/byId/:_id').get(HospitalCtrl.getById);
  router.route('/private/hospital/update').post(HospitalCtrl.update);
  router.route('/hospital/listCtrlStock').post(HospitalCtrl.listCtrl);
  router.route('/private/extras/saveRooms').post(HospitalCtrl.saveRooms);
  router.route('/private/hospitals/delete').post(HospitalCtrl.deleteHospital);
}
