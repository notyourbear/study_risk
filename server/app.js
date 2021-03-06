var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');
var apiMapRoutes = require('./api/routes/map');
var apiQuestionRoutes = require('./api/routes/questions');
var apiUserRoutes = require('./api/routes/user');
var apiListRoutes = require('./api/routes/list');
var apiRadioRoutes = require('./api/routes/radio');

var db = require('./api/models');

var hbs = require('hbs');
var hbsutils = require('hbs-utils')(hbs);

var Sequelize = require('sequelize');
var app = express();


// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

hbsutils.registerWatchedPartials(__dirname + '/views/templates', {
  onchange: function(t){
    console.log(t, ' changed!');
    }
  }, function() {
      console.log("partials registered");
  });


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../', 'dist')));

app.use(session({
  secret: 'thisisasupersecretkey',
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false
}));

//login middleware 
app.use("/", function (req, res, next) {

  req.login = function (user) {
    req.session.userId = user.id;
  };

  req.currentUser = function (cb) {
    return db.User.
      find({
        where: {
          id: req.session.userId
       }
      }).
      then(function (user) {
        req.session.user = user;
        cb(user);
      });
  };

  req.logout = function () {
    req.session.userId = null;
    req.session.user = null;
  };

  next();
});

app.use('/', routes);
app.use('/api/map', apiMapRoutes);
app.use('/api/questions', apiQuestionRoutes);
app.use('/api/users', apiUserRoutes);
app.use('/api/lists', apiListRoutes);
app.use('/api/radios', apiRadioRoutes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
