var ProfilesModel = require('./profiles.scheme');
var ModulesModel = require('./modules.scheme');

function save(data, cb) {
	findOneProfile(data, function (err, response) {
		if (err) return cb(err);

		if (!response.exists) {
			ProfilesModel.create(data, function (err, profile) {
				if (err) return cb(err);
	
				return cb(null, { success: true, message: 'El perfil ' + profile.name + ' se ha creado correctamente.'});
			})
		}else{
			return cb(null, { success: false, message: 'El perfil ' + data.name + ' ya se encuentra registrado.'})
		}
	});
}

function update(data, cb) {
	findOneProfile(data, function (err, response) {
		if (err) return cb(err);

		var list = response.list;
		if (response.exists) {
			if (list._id == data._id) {
				ProfilesModel.findByIdAndUpdate({ 
					_id : data._id
				}, {
					$set : data
				}, function (err, update) {
					if (err) return cb(err);

					return cb(null, { success: true, message : 'El perfil ' + data.name + ' se ha actualizado correctamente.'});
				})
			} else {
				return cb(null, { success: false, message : 'El perfil ' + data.name + ' ya se encuentra registrado.'})
			}
		}else{
			ProfilesModel.findByIdAndUpdate({ 
				_id : data._id
			}, {
				$set : data
			}, function (err, update) {
				if (err) return cb(err);

				return cb(null, { success: true, message : 'El perfil ' + data.name + ' se ha actualizado correctamente.'});
			})
		}
	});
}

function findOneProfile(data, cb) {
	var name = new RegExp(data.name, 'i');

	ProfilesModel.findOne({ 'name' : name }, function (err, response) {
		if (err) return cb(err);

		if (response != null) {
			return cb(null, { exists : true, list : response });
		}else{
			return cb(null, { exists : false, list : {} });
		}
	});
}

function getList(object, cb) {
	var stages = [];
	
	stages.push({
	  $match: object.params
	});
	stages.push({
		$skip: object.pager.limit * (object.pager.page - 1)
	});
	stages.push({
		$limit: object.pager.limit
	});
  
	ProfilesModel
	  .aggregate(stages).exec(function (err, response) {
		if (err) return cb(err);

		getModules({}, function (err, result) {
			
			for (let a = 0; a < result.length; a++) {
				for (let b = 0; b < response.length; b++) {
					let exist = false;
					for (let c = 0; c < response[b].permissions.length; c++) {
						if(result[a].moduleId == response[b].permissions[c].moduleId){
							exist = true;
							for (let d = 0; d < result[a].privileges.length; d++) {
								let exist2 = false;
								for (let e = 0; e < response[b].permissions[c].privileges.length; e++) {
									if(result[a].privileges[d].name == response[b].permissions[c].privileges[e].name){
										exist2 = true;
										break;
									}
								}
								if(!exist2)
									response[b].permissions[c].privileges.push(result[a].privileges[d]);
							}
						}
					}
					if(!exist)
						response[b].permissions.push(result[a]);
				}
			}
			object.results.data = response;
			return cb(null, object);	
		})
	});
}

function count(object, callback) {
	var stages = [];
	
	stages.push({
	  $match: object.params
	});
  
	stages.push({
	  $count: 'count'
	});
  
	ProfilesModel
	  .aggregate(stages)
	  .exec(function (err, response) {
		if (err) {
		  return callback(err);
		}
		if (response.length > 0)
		  object.results.count = response[0].count;
		else
		  object.results.count = 0;
		return callback(null, object);
	  });
  }

function getModules(data, cb){
	ModulesModel.find(data, function (err, response) {
		if (err) return cb(err, null);

		return cb(null, response);
	});
}


module.exports.save = save;
module.exports.update = update;
module.exports.getList = getList;
module.exports.count = count;
module.exports.getModules = getModules;