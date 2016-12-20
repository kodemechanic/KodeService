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

router.get('/:username', passport.authenticate('bearer',{session: false}), function(req,res){
	// Possibly change this to check for more than one and require a find by ID if more than one user available.
  User.findOne({"username": req.username}, function(err, user) {
    if (err)
      res.status(400).send(err);
      
    if (!user) {
      res.status(400).send({"message":"User does not exist"});
    } else {
      res.status(200).send({results: user});
    }      
  });
});

router.post('/', function(req,res){
	// CREATE NEW USER FROM POST to /users/		
  	var collection = mongo.client.collection('users');
    collection.findOne({"username": req.body.username}, function(err, existing){
  		if (err) { res.status(400).send({error: err}); }

  		if (!existing) {
  			var str = req.body.username.replace(/[^a-zA-Z0-9]/g, "");
  			var user = new User({
		        username: req.body.username,
		        password: req.body.password,
		        userid: str,
		        email: req.body.email,
		        accesslevel: "W"
		    });

		    // TODO... ADD CODE TO CHECK FOR DUPLICATE EMAIL ADDRESSES.  						
		    user.save(function(err, newUser) {
		        if (err){
		          res.status(400).send(err); 
		        } else {
		          res.status(200).send({results: newUser});
		        }
		    });
		}  // if !existing
		else {
		    res.status(400).send({"status": "duplicate username"});
		};
  		
  	});

});


router.put('/:username', passport.authenticate('bearer',{session: false}), function(req, res) {
  // This update should not updateE _ID, USERNAME, or USERNUM.  Only update email and passwd
  User.findOne({"username": req.username}, function(err, user) {
    if (err)
      res.status(400).send({error: err});
    
    if (req.body.password) { user.password = req.body.password; }
    if (req.body.email) { user.email = req.body.email; }
    
    user.save(function(err, newUser){
      if (err)
        res.status(400).send(err);
    
      res.status(200).send({results: newUser});
    });
  });  
});

// DELETE USER (NEEDED FOR TESTING ONLY).  SOFT DELETE WILL BE PUT IN FOR PRODUCTION RELEASE.
router.delete('/:username', passport.authenticate('bearer',{session: false}), function(req, res) {

 	 // Remove all collections for this user
  	mongo.client.collections(function(err,data){
  		if(err) { 
        	res.status(500).send({error: err}); 
        }
        else {
		    // String to compare collections to
		    var myUserCollections = req.params.username + ".";

        console.log("myuserCollextions: " + myUserCollections);
	    
// ***** TODO - ESCAPE THIS LOOP OR REWORK TO SEARCH THE ARRAY TO IMPROVE PERFORMANCE
// *****    current code gets all collections in DB and removes based on comparing each coll name to the myUserCollections var.

		    // Loop through collection list to drop collections from DB. 
		    for (var x = 0; x < data.length; x++) {

console.log("indexOf: " + data[x].s.name.indexOf(myUserCollections));

			    if (data[x].s.name.indexOf(myUserCollections) == 0) {

			 //       var tempColl = data[x].s.name.indexOf(myUserCollections);
			        // trim off the "rest." db reference
			   //     tempColl = tempColl.toString().slice(5);
			        
//   *******   REMOVE!!!!
console.log("REMOVING USER COLLECTIONS");


			        var thisCollection = mongo.client.collection(data[x].s.name);

			        thisCollection.drop(function(err, reply){
			          if (err) { res.status(500).send({error: err}); }
			        });
			    }
		    }

	    	User.findOneAndRemove({userid: req.username}, function(err, data) {		
			    if (err) { 
			    	res.status(400).send({error: err}); 
			    } else {			    	
			    	if (data == null){			    	
			    		res.status(400).send({message: "User does not exist"});
			    	} else {
			   	 		res.status(200).send({results: "User Deleted"});
			    	}
			    }
			    
			});
		};
  	});
});



//  **************   USER SERVICES FUNCTIONS *****************


router.get('/:username/service', passport.authenticate('bearer',{session: false}), function(req,res){
// Possibly change this to check for more than one and require a find by ID if more than one user available.
  User.findOne({"username": req.username}, function(err, user) {
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


router.post('/:username/service', passport.authenticate('bearer',{session: false}), function(req,res){
	User.findOne({userid: req.username}, function(err, user){
	    if (err) { res.status(400).send(err); }
	    
	    if (inObject(user.apps, req.body.appname)){
	      // app already exists
	      res.status(400).send({error: "AppName already exists"});
	    }
	    else {      
	      var str = req.body.appname.replace(/[^a-zA-Z0-9]/g, "");
	      var newApp = {
	        appid: str,
	        appname: req.body.appname,
	        appdesc: req.body.appdesc,
	        secret: req.body.secret
	      };
	  
	      user.apps.push(newApp);				
	      user.save(function(err, newUser) {
	        if (err)
	          res.status(400).send({error: err});
	        res.status(200).send({results: newUser});
	      });
			}
	  });
});

router.put('/:username/service/:service', passport.authenticate('bearer',{session: false}), function(req, res) {
  
  // Create new object
  var newApp = {
    appname: req.body.appname,
    appdesc: req.body.apptype,
    secret: req.body.secret
  };

  User.findOneAndUpdate(
    {"username": req.username, "apps.appname": req.servicename},
    {"$set": {"apps.$": newApp}},    
    function(err, newUser){
		if (err) { 
			res.status(400).send({error: err}); 
		}
		res.status(200).send({"status":"successful"});  
	}
  );

});

router.delete('/:username/service/:servicename', passport.authenticate('bearer',{session: false}), function(req, res) {

  // removes the single app with a $pull query, autosaving the result
  User.update({"username": req.username},{ $pull: { "apps" : { appid: req.servicename }}}, function(err, user){
    if (err)
      res.status(400).send({error: err});
    res.status(200).send({"status":"successful"});
  });
  
  // remove collections created for this application.
  mongo.client.collections(function(err,collections){
    if (err)
      res.status(400).send({error:err});
    
    // String to compare collections to
    var myService = "." + req.username + "." + req.servicename + ".";
        

// ***** TODO - ESCAPE THIS LOOP OR REWORK TO SEARCH THE ARRAY TO IMPROVE PERFORMANCE
// *****    current code gets all collections in DB and removes based on comparing each coll name to the myService var.

	  
    // Loop through collection list to drop collections from DB. 
    for (var x = 0; x < collections.length; x++) {
      if (collections[x].s.name.indexOf(myService) > -1) {
        
        var tempColl = collections[x].s.name;
        // trim off the "rest." db reference
        tempColl = tempColl.toString().slice(5);

        var thisCollection = db.collection(tempColl);

        thisCollection.drop(function(err, reply){
          if (err) { 
          	res.status(500).send({error: err}); 
          }
        });
      }
    }
  });  
});

router.put('/:username/info', passport.authenticate('bearer',{session:false}), function(req,res){
  var userInfo = {
    firstName: req.body.firstName,
		lastName: req.body.lastName,
		address: req.body.address,
		city: req.body.city,
		state: req.body.state,
		zip: req.body.zip,
		country: req.body.country,
		phone: req.body.phone,
		website: req.body.website,
		notes: req.body.notes
  };

  usr = User.where({username: req.params.user});  
    
  usr.update({ "userinfo": userInfo}, function(err, success){
    
    if (err) { res.status(400).send(err); }
    
    if (success === 0) { res.status(200).json({"error": "Invalid Username"})};
    
    res.status(200).json({"status": "success"});  
  }); 
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
