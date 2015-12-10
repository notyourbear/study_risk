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
   
    db.User.findById(req.session.user.id).then(function(user){
      user.addList(list);
    })
    .then(function(){
        if(list){
          sendJsonResponse(res, 200, list);
        } else {
          sendJsonResponse(res, 400, {'error': 'something went wrong'});
        }
     });
   
  });
  
};

module.exports.all = function(req, res, next){
  db.List.findAll(
  {
    include: db.Radio
  })
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
      },
      include: [db.Radio]
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

module.exports.single = function(req, res, next){
  db.List.find({
    where: {
      id: req.params.id
    },
    include: [db.Radio]
  })
    .then(function(list){
      if(list.private === false){
        sendJsonResponse(res, '200', list);
      } else if (req.session.user && list.UserId === req.session.user.id){
        sendJsonResponse(res, '200', list);
      } else if (req.session.user.id !== list.UserId) {
        sendJsonResponse(res, '400', {error: 'list not associated with user'});
      } else {
        sendJsonResponse(res, '400', {error: 'not a public list and user is not logged in'});
      }
    });
};

module.exports.edit = function(req, res, next){
  var list = {
    id: req.body.id,
    name: req.body.name,
    description: req.body.description
  };

  console.log('list', list);

  if(!req.session.user){
    sendJsonResponse(res, '400', {'error': 'not logged in'});
  } else {
    db.List.find({
      where: {id: req.body.id},
      include: [db.Radio]
    })
    .then(function(l){
      console.log('l', l);
      l.update(list);
      return l;
    })
    .then(function(l){
      sendJsonResponse(res, '200', l);
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