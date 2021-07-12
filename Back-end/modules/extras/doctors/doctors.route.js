var DoctorsCtrl = require('./doctors.ctrl')

module.exports = function (app, router) {
  router.route('/private/doctor/save').post(DoctorsCtrl.save);
  router.route('/private/doctor/list').put(DoctorsCtrl.list);
  router.route('/private/doctor/byId/:_id').get(DoctorsCtrl.getById);
  router.route('/private/doctor/update').post(DoctorsCtrl.update);
  router.route('/private/doctor/delete/:_id').get(DoctorsCtrl.deleteDoctor);
}
