module.exports.index = function(req, res, next) {
  res.render('index', { title: 'Express' });
};

module.exports.game = function(req, res, next) {
  res.render('game', { title: 'Riskionaire'});
};