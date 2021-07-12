var ProfilesLib = require('./profiles.lib');
var async = require('async')

function saveProfile(req, res, next) {
	var data = req.body;

	ProfilesLib.save(data, function (err, response) {
		if (err) return res.status(500).send(err);

		return res.status(201).send(response);
	});
}

function updateProfile(req, res, next) {
	var data = req.body;

	ProfilesLib.update(data, function (err, response) {
		if (err) return res.status.send(err);

		return res.status(201).send(response);
	});
}

function getProfiles(req, res, next) {
	var params = req.body;
	var object = {
		params: mapParams(req.body),
		pager: params.pager,
		results: {}
	};
	
	var process = [
		async.apply(ProfilesLib.count, object),
		ProfilesLib.getList
	];
	async.waterfall(process, callback);

	function callback(err, response) {
		if (err) return res.status.send(err);

		return res.status(201).send(response.results);
	}
}


function getModules(req, res, next) {
	ProfilesLib.getModules({}, function (err, response) {
		if (err) return res.status.send(err);

		return res.status(201).send({
			data : response,
			success : true
		});
	});
}

function mapParams(params) {
	var query = {};
  
	if (params.filtering.name) {
	  query = { 'name' : new RegExp(params.filtering.name, 'i') };
	}
	
	return query;
}



module.exports.saveProfile = saveProfile;
module.exports.updateProfile = updateProfile;
module.exports.getProfiles = getProfiles;
module.exports.getModules = getModules;