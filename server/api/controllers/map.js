var sendJsonResponse = function(res, status, content){
  res.status(status);
  res.json(content);
};

var env = process.env;
var states = require('../../stateData');

module.exports.token = function(req, res, next){
  var token = {
    token: env.mapToken,
    map: env.map
  };

  sendJsonResponse(res, '200', token);
};

module.exports.allStates = function(req, res, next){
  var state = states.all();
  sendJsonResponse(res, '200', state);
};

module.exports.state = function(req, res, next){
  var stateName = req.params.name;

  var state = states[stateName]();

  sendJsonResponse(res, '200', state);
};

