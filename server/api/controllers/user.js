var sendJsonResponse = function(res, status, content){
  res.status(status);
  res.json(content);
};

var db = require('../models/');

module.exports.all = function(req, res, next){
  db.User.findAll()
    .then(function(users){
      if(!users){
        sendJsonResponse(res, '400', {'error': 'no users found'});
      } else {
        var obj = {usrs: users};
        sendJsonResponse(res, '200', obj);
      }
    });
};

module.exports.create = function(req, res, next){
  var user = {
    email: req.body.email,
    password: req.body.password
  };

  db.User.createSecure(user.email, user.password).
  then(function(createdUser){
    sendJsonResponse(res, 200, createdUser);
  });


};