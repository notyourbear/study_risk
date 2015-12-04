module.exports.signup = function(req, res, next) {
  res.render('signup', { title: 'Riskionaire' });
};

module.exports.login = function(req, res, next){
  res.render('login', {title: 'Riskionaire'});
};

module.exports.profile = function(req, res, next){
  console.log(user, 'user');
  console.log(req.session.user, 'req user');
  res.render('profile', {title: 'Risk', user: req.session.user.email});
};
