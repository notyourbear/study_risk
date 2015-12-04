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

module.exports.userLists = function(req, res, next){
  if(!req.session.user){
    sendJsonResponse(res, '400', {'error': 'user not logged in'});
  } else {
    db.List.findAll({
      where: {
        UserId: req.session.user.id
      }
    }).then(function(lists){
      if(!lists){
          sendJsonResponse(res, '400', {'error': 'no lists found'});
        } else {
          var obj = {lsts: lists};
          sendJsonResponse(res, '200', obj);
        }
    });
  }
};

module.exports.destroy = function(req, res, next){
  if(!req.session.user){
    sendJsonResponse(res, '400', {'error': 'not logged in'});
  } else {
    db.List.findById(req.params.id)
      .then(function(list){
        if(list.UserId !== req.session.user.id){
          sendJsonResponse(res, '400', {'error': 'not the owner of the list. cannot delete.'});
        } else {
          return list.destroy();
        }
      }).then(function(){
        sendJsonResponse(res, '200', {'destroyed': req.params.id});
      });
  }
};