var env	= process.env.NODE_ENV || '';
var path = require("path");
var rootPath = path.normalize(__dirname + '/..');
require('dotenv').config({path: rootPath + '/.env' + (env ? '.' + env : '')});

function createConfig() {

  return {
    db : {
      user: process.env.MONGO_USER,
      password : process.env.MONGO_PASS,
      cluster : process.env.MONGO_CLUSTER,
      ip : process.env.MONGO_IP,
      db : process.env.MONGO_DB,
      port: process.env.MONGO_PORT
    },
    root: rootPath,
    app: {
      name: process.env.APP_NAME
    },
    secret : process.env.SECRET,
    port: parseInt(process.env.PORT),
    isProduction: (process.env.PRODUCTION === "true")
  };
}


exports.createConfig = createConfig;
