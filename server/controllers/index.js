module.exports.index = function(req, res, next) {
  info = {
     title: 'Riskionaire',
     description1: 'Take over the States.',
     description2: 'One question at a time.'
  };

  res.render('index', info);
};

module.exports.test = function(req, res, next){
  res.render('test', { title: 'testing', layout: 'testLayout'});
};

module.exports.game = function(req, res, next) {
  res.render('game', { title: 'Riskionaire'});
};

module.exports.quickPlay = function(req, res, next) {
  res.render('game', { title: 'Riskionaire Quickplay' })
}
