module.exports.index = function(req, res, next) {
  res.render('index', { title: 'Express' });
};

module.exports.test = function(req, res, next){
  res.render('test', { title: 'testing', layout: 'testLayout'});
};

module.exports.game = function(req, res, next) {
  res.render('game', { title: 'Riskionaire'});
};