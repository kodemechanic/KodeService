var express = require('express');
var router = express.Router();
var async = require('async');

var mongo = require('../config/db/mongodb.js');
var mongoose = require('../config/db/mongoose.js');

var User = require('../config/models/usermodel');

var passport = require('../config/passport.js');


//  **********   Dashboard  ********************
router.get('/', function(req, res){
	res.render('dashboard', {title: "Dashboard"});
});

router.get('/:oState', function(req, res){
  res.render('dashboard', {openState: req.params.oState, title: "Dashboard"});  
});

module.exports = router;
