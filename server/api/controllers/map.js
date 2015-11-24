var sendJsonResponse = function(res, status, content){
  res.status(status);
  res.json(content);
};

var secrets = require('../../../secrets');
var states = require('../../stateData');

module.exports.token = function(req, res, next){
  var token = secrets.mapAccessToken();

  sendJsonResponse(res, '200', token);
};

module.exports.state = function(req, res, next){
  var stateName = req.params.name;

  var state = states[stateName]();

  sendJsonResponse(res, '200', state);
};

