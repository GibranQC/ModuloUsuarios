(function(){
	'use strict';

	var jwt = require('jwt-simple');
	var moment = require('moment');
	var secret = 'CR@@n3st3s1@2020';

	exports.validateToken = function(request, response, next){
		if(!request.headers.authorization){
			return response.status(401).send({ error: 'Usuario no autorizado.' });
		}

        var token = request.headers.authorization.replace(/['"]+/g, '').replace('Bearer ', '');
        
		var payload = {};

		try {
			payload = jwt.decode(token, secret);

			if(payload.exp <= moment().unix()){
				response.status(401).send({ error: 'El token ha expirado.' });
			}
		} catch(ex) {
			return response.status(401).send({ error: 'Token no valido.' });
		}

		request.user = payload;
		next();
	};
})();