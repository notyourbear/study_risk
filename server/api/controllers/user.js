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
    req.login(createdUser);
    req.currentUser(function(createdUser){
      sendJsonResponse(res, 200, createdUser);
    });
  });

};

module.exports.login = function(req, res, next){
  var user = {
    email: req.body.email,
    password: req.body.password
  };

  db.User
    .authenticate(user.email, user.password)
    .then(function (user) {
          if(!user){
            sendJsonResponse(res, 400, {'error': 'user not found'});
          }
          // note here the super step
          req.login(user);
          req.currentUser(function(user){
            sendJsonResponse(res, 200, user);
          });
      });
};

module.exports.logout = function(req, res, next){
  req.logout();
  sendJsonResponse(res, 200, {'complete': 'logged out'});
};