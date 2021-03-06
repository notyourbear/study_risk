var sendJsonResponse = function(res, status, content){
  res.status(status);
  res.json(content);
};

var db = require('../models/');

module.exports.create = function(req, res, next){
  var radio = {
    question: req.body.question,
    answer: req.body.answer
  };
  
  for(var i = 1; i <= 5; i++){
    var f = "false"+i;

    if(req.body[f] !== null){
      radio[f] = req.body[f];
    }
  }
    
  db.Radio.create(radio)
  .then(function(radio){
    db.User.findById(req.session.user.id).then(function(user){
      user.addRadio(radio);
    })
    .then(function(){
        if(radio){
          sendJsonResponse(res, 200, radio);
        } else {
          sendJsonResponse(res, 400, {'error': 'something went wrong'});
        }
     });
   
  });
};

module.exports.all = function(req, res, next){
  console.log('trying to access questions!');
  db.Radio.findAll({
    include: db.List
  }).then(function(questions){
    console.log(questions);
    if(!questions){
        sendJsonResponse(res, '400', {'error': 'no radio questions found'});
      } else {
        var obj = {radio: questions};
        sendJsonResponse(res, '200', obj);
      }
  });
};

module.exports.user = function(req, res, next){
  if(!req.session.user){
    sendJsonResponse(res, '400', {'error': 'user not logged in'});
  } else {
    db.Radio.findAll({
      where: {
        UserId: req.session.user.id
      },
      include: [db.List]
    }).then(function(questions){
      if(!questions){
          sendJsonResponse(res, '400', {'error': 'no radio questions found'});
        } else {
          var obj = {radio: questions};
          sendJsonResponse(res, '200', obj);
        }
    });
  }
};

module.exports.associateWithList = function(req, res, next){
  if(!req.session.user){
    sendJsonResponse(res, '400', {'error': 'user not logged in'});
  } else {
    var listId = req.body.listId;
    var questionId = req.body.questionId;

    db.Radio.findById(questionId).then(function(q){
      db.List.findById(listId).then(function(list){
        list.addRadio(q).then(function(){
          if(list){
            sendJsonResponse(res, 200, list);
          } else {
            sendJsonResponse(res, 400, {'error': 'something went wrong'});
          }
        });
      });
    });
  }
};

module.exports.removeFromList = function(req, res, next){
  if(!req.session.user){
    sendJsonResponse(res, '400', {'error': 'user not logged in'});
  } else {
    var listId = req.body.listId;
    var questionId = req.body.questionId;

    db.Radio.findById(questionId).then(function(q){
      db.List.findById(listId).then(function(list){
        list.removeRadio(q).then(function(){
          if(list){
            sendJsonResponse(res, 200, list);
          } else {
            sendJsonResponse(res, 400, {'error': 'something went wrong'});
          }
        });
      });
    });
  }
};

module.exports.edit = function(req, res, next){
  var radio = {
    id: req.body.id,
    question: req.body.question,
    false1: req.body.false1 || '',
    false2: req.body.false2 || '',
    false3: req.body.false3 || '',
    false4: req.body.false4 || '',
    false5: req.body.false5 || ''
  };

  if(!req.session.user){
    sendJsonResponse(res, '400', {'error': 'not logged in'});
  } else {
    db.Radio.find({
        where: {id: req.body.id},
        include: [db.List]
      })
    .then(function(q){
      q.update(radio);
      return q;
    })
    .then(function(q){
      sendJsonResponse(res, '200', q);
    });
  }
};

module.exports.destroy = function(req, res, next){
  if(!req.session.user){
    sendJsonResponse(res, '400', {'error': 'not logged in'});
  } else {
    db.Radio.findById(req.params.id)
      .then(function(q){
        if(q.UserId !== req.session.user.id){
          sendJsonResponse(res, '400', {'error': 'not the owner of the question. cannot delete.'});
        } else {
          return q.destroy();
        }
      }).then(function(){
        sendJsonResponse(res, '200', {'destroyed': req.params.id});
      });
  }
};