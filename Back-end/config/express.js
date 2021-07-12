//Libs
var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var fs = require('fs')

module.exports = function(app) {
    var port = app.config.port || 9002;
    app.set('showStackError', true);
    app.use(express["static"]("" + app.config.root + "/public/client"));
    app.use(express["static"]("" + app.config.root + "/public/files"));
    
    app.set('port', port);
    app.use(expressValidator());
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

    var dir = app.config.root + '/public' + '/files/'
  	if(!fs.existsSync(dir)){
      	fs.mkdirSync(dir);
    	}
  	var dir2 = dir + 'assets/'
  	if(!fs.existsSync(dir2)){
    	fs.mkdirSync(dir2);
  	}
};
