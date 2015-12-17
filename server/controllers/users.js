module.exports.profile = function(req, res, next){
  console.log(req.session.user, 'req user');
  res.render('profile', {title: 'Risk', user: req.session.user});
};
