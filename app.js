var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');
var passport = require('passport');
var jwt = require('jwt-simple');

var mdb = require('./config/db/mongodb');
var db  = require('./config/db/mongoose');

var users = require('./routes/users');  
var routes = require('./routes/index'); 
var userAPI = require('./routes/userAPI');  
var service = require('./routes/service');  
var collection = require('./routes/collection');  
var item = require('./routes/item');  

var app = express(); 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// initialize passport for authentication
app.use(session({secret: 'mmaufcandkoding', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Configure database connection and pass to end points.
mdb.init(function (error) {
  if (error)
    throw error;
});

app.use(function(req,res,next){
    req.db = mdb;    
    next();
});


//  CHECK PARAMETERS TO DETERMINE ROUTES
app.param('user', function(req, res, next, user){  
  req.puser = user;  
  next();
});

app.param('service', function(req, res, next, service){  
  req.pservice = service;
  next();
});

app.param('collection', function(req, res, next, collection){  
  req.pcollection = collection;
  next();
});

app.param('item', function(req, res, next, item){  
  req.pitem = item;  
  next();
});

// Authentication Routes
app.use('/user', users);  // login and logout functions here as well.
app.use('/api', routes);  // reroute someone to instructions or home page.  login/logout here as well.
app.use('/', routes);  // change to use the homepage link or redirect to the home page app....

// API routes
app.use('/api/:user/:service/:collection/:item', passport.authenticate('bearer',{session: false}), item);
app.use('/api/:user/:service/:collection', passport.authenticate('bearer',{session: false}), collection);
app.use('/api/:user/:service', passport.authenticate('bearer',{session: false}), service);
app.use('/api/:user', passport.authenticate('bearer',{session: false}), userAPI);  // return a list of services.  GET only, service maintenance done in the Admin tool.

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
