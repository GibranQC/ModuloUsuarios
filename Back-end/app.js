var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var io = require('socket.io')(server);
var cors = require('cors');
// var socket = require('./routes/socket.js');
var app = express();
var router = express.Router();
var server = require('http').Server(app);
var env = process.env.NODE_ENV || 'development';
var config = require('./config/config').createConfig();

var AccountSchema = require('./modules/extras/scheme/accouts.scheme');

global.config = config;

app.env = env;
app.config = config;
app.name = config.app.name;
app.secret = config.secret;

var dbUrl = 'mongodb://localhost:27017/Users';
console.log(dbUrl)
mongoose.connection.openUri(dbUrl, {}, function (err, response) {
  if (err) {
    return console.log("Error : ", err);
  }
  console.log('Connected to Database');
});

//passport.use(new LocalStrategy(AccountSchema.authenticate()));
//passport.serializeUser(AccountSchema.serializeUser());
//passport.deserializeUser(AccountSchema.deserializeUser());

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
});
app.use(cors());

require('./config/express')(app);
require('./modules/routes')(app, router);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/dist'));
// app.use(methodOverride());

app.use('/', router);

server.listen(app.get('port'), function () {
  console.log("\n" + config.app.name + " SERVER RUNNING ON: " + app.get('port'));
});
