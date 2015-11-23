var sendJsonResponse = function(res, status, content){
  res.status(status);
  res.json(content);
};

var secrets = require('../../../secrets.js');

module.exports.token = function(req, res, next){
  var token = secrets.mapAccessToken();

  sendJsonResponse(res, '200', {accessToken: token});
};


