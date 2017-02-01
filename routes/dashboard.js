var express = require('express');
var router = express.Router();
var async = require('async');

var mongo = require('../config/db/mongodb.js');
var mongoose = require('../config/db/mongoose.js');

var User = require('../config/models/usermodel');

var passport = require('../config/passport.js');



router.param('username', function(req, res, next, username){  
  req.username = username;    
  next();
});

router.param('servicename', function(req, res, next, servicename){  
  req.servicename = servicename;
  next();
});
 


//  **********   LOGIN and LOGOUT  ********************

router.post('/authenticate', passport.authenticate('user-basic',{session: false}),function(req,res){    
    res.status(200).send(res.req.user);  
});


//  **************   USER FUNCTIONS *****************
/* GET users listing. */
router.get('/', passport.authenticate('bearer',{session: false}), function(req, res) {
    User.find(function(err, users) {
    	if (err) {  res.status(400).send(err);	}    	
    	res.status(200).send({results: users});
  	});
});



module.exports = router;
