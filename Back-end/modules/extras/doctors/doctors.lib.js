var DoctorsScheme = require('./doctors.scheme');




module.exports.save = save;
module.exports.list = list;
module.exports.count = count;
module.exports.getById = getById;
module.exports.update = update;
module.exports.deleteDoctor = deleteDoctor;

function save(object, callback) {
  let data = object

  var patient = new DoctorsScheme(data);
  patient.save(function (err, responsePatient) {
    if (err) {
      err.status_code = 500
      return callback(err);
    }
    object.response = responsePatient
    var data = {_id : responsePatient._id}
    return callback(null,data)
  });
}

function list(object, callback) {
  var query = object.params;
  var pager = object.pager;
  var stages = [];
  stages.push({
    $match: query
  });
  stages.push({
    $project: {
      _id: 1,
      name: 1,
      lastname: 1,
      lastname2: 1,
      fullname: 1,
      number_proceedings: 1,
      gender: 1,
      birthdate: 1,
      age: 1,
      is_active: 1
    }
  });
  stages.push({
    $sort: {
      "fullname": 1
    }
  })
  stages.push({
    $skip: pager.limit * (pager.skip - 1)
  });
  stages.push({
    $limit: pager.limit
  });
  DoctorsScheme
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

function count(object, callback) {
  var query = object.params;
  var stages = [];

  stages.push({
    $match: query
  });

  stages.push({
    $count: 'count'
  });

  DoctorsScheme
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
  DoctorsScheme.findById(_id, function (err, response) {
    if (err) {
      err.status_code = 500
      return callback(null, object)
    }
    if (response.length == 0) {
      err.status_code = 304
      err.message = "PATIENT_NOT_FOUND"
      return callback(err, null)
    } else {
      object.hospital = response
      return callback(null, object.hospital)
    }
  });
}

function update(object, callback) {
  var _id = object._id
  var data = object
  DoctorsScheme.findByIdAndUpdate(_id, data, function (err, response) {
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

function deleteDoctor(object, callback) {
  var _id = object._id
  
  DoctorsScheme.remove({"_id":create_object_id(_id)}, function (err, response) {
    if (err) {
      err.status_code = 500
      callback(err, null)
    }
    if (!response) {
      err.status_code = 304
      err.message = "PATIENT_NOT_UPDATE"
      callback(err, null)
    } else {
      response= {delete:true}
      callback(null, response)
    }
  });
}

function create_object_id(_id) {
  var mongoose = require('mongoose');
  return mongoose.Types.ObjectId(_id)
}