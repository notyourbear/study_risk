var sendJsonResponse = function(res, status, content){
  res.status(status);
  res.json(content);
};

var db = require('../models/');

module.exports.create = function(req, res, next){
  var list = {
    name: req.body.name,
    description: req.body.description,
    private: req.body.private
  };

  db.List.create(list)
  .then(function(list){
    console.log('here!');
    console.log('user', req.session.user);

    db.User.findById(req.session.user.id).then(function(user){
      console.log('USER');
      user.addList(list);
    })
    .then(function(){
      console.log('thid place', list);
        if(list){
          sendJsonResponse(res, 200, list);
        } else {
          sendJsonResponse(res, 400, {'error': 'something went wrong'});
        }
     });
   
  });
  
};

module.exports.all = function(req, res, next){
  db.List.findAll()
    .then(function(lists){
      if(!lists){
        sendJsonResponse(res, '400', {'error': 'no lists found'});
      } else {
        var obj = {lsts: lists};
        sendJsonResponse(res, '200', obj);
      }
    });
};