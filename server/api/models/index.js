'use strict';

// process.env.JAWSDB_URL

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(path.join(__dirname, '../../../database/config/config.json'))[env];
var db        = {};

console.log(env);
console.log(config);
console.log(config.use_env_variable);

if (config.use_env_variable) {
  console.log("\n\n\n\n\n\n\n\n\n\n\n");
  console.log(process.env[config.use_env_variable]);
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
  
  
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
