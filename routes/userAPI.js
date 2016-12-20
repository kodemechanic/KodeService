var express = require('express');
var router = express.Router();
var async = require('async');
var mongo = require('../config/db/mongodb.js');
var mongoose = require('../config/db/mongoose.js');
var User = require('../config/models/usermodel');


router.get('/', function(req,res){	
	// Possibly change this to check for more than one and require a find by ID if more than one user available.
  User.findOne({"username": req.puser}, function(err, user) {
    if (err)
      res.status(400).send(err);      
    if (!user) {
      res.status(400).send({"message":"Invalid request."});
    } else {
      var services = user.apps;      
      res.status(200).send({results: services});
    }      
  });		
});

router.post('/', function(req,res){
  res.status(200).send("Service Management (create/update/delete of services) must be completed in the User Dashboard.");
});
router.put('/', function(req,res){
  res.status(200).send("Service Management (create/update/delete of services) must be completed in the User Dashboard.");
});
router.delete('/', function(req,res){
  res.status(200).send("Service Management (create/update/delete of services) must be completed in the User Dashboard.");
});

// CREATE ADMIN should be in AdminUser file, not this file... not included here.  Check user.js in old api for details.

function inObject(arr, search) {
  var len = arr.length;
  while (len-- ) {
    if(arr[len].appname === search)
      return true;
  }
}

module.exports = router;