// Load required packages
var express = require('express');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy;

var User = require('./models/usermodel');
var Token = require('./models/tokenmodel');
var jwt  = require('jwt-simple');
var apisecret = 'kodemechanicAPI';
var usersecret = 'myusersecret123xi1u';


passport.use('api-basic', new BasicStrategy(
  
  function(username, password, callback) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return callback(err); }

      // No user found with that username
      if (!user) { return callback(null, false, 'Invalid username'); }

      // Make sure the password is correct
      user.verifyPassword(password, function(err, isMatch) {
        if (err) { return callback(err); }
      
        // Password did not match
        if (!isMatch) { return callback(null, false, 'Invalid password'); }

        // Success, create token and pass to user
        
        // CREATE TOKEN based on User/url.  Send URL if /login/:user/:app are provided.
        var result = {};
        var newDate = new Date(); 
        var tempToken = "{user:" + username + ",expire:" + newDate + "}";
        
        // set correct scope based on current authentication URL
        var newScope = "/api/" + username + "/";
 		

        var token = new Token({
          token : jwt.encode(tempToken, apisecret),
          user : username,
          access : "Read",
          scope : newScope,
          status : "A"
        });
        
        // SAVE TOKEN
        token.save(function(err, newToken) {
          if (err) {           
          	console.log(err); 
            return callback(err, false, 'Database error: Token not saved.'); 
          }
        });    
      
       // RETURN TOKEN WITH USER        
        callback(null, token);
      });
    });
  }
));

passport.use('user-basic', new BasicStrategy(  
  function(username, password, callback) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return callback(err); }

      // No user found with that username
      if (!user) { return callback(null, false, 'Invalid username'); }

      // Make sure the password is correct
      user.verifyPassword(password, function(err, isMatch) {
        if (err) { return callback(err); }
      
        // Password did not match
        if (!isMatch) { return callback(null, false, 'Invalid password'); }

        // Success, create token and pass to user
        
        // CREATE TOKEN based on User/url.  
        var result = {};
        var newDate = new Date(); 
        var tempToken = "{user:" + username + ",expire:" + newDate + "}";
        
        // set correct scope based on current authentication URL
        var newScope = "/user/" + username + "/";
 		

        var token = new Token({
          token : jwt.encode(tempToken, usersecret),
          user : username,
          access : "Read",
          scope : newScope,
          status : "A"
        });
        
        // SAVE TOKEN
        token.save(function(err, newToken) {
          if (err) {           
          	console.log(err); 
            return callback(err, false, 'Database error: Token not saved.'); 
          }
        });    
      
       // RETURN TOKEN WITH USER        
        callback(null, token);
      });
    });
  }
));

passport.use(new BearerStrategy(  
  {passReqToCallback: true},
  function(req, token, done) {
  
    // rebuild path to include username and app if needed.
    var path = req.originalUrl;
    
    Token.findOne({ token: token },
      function(err, validToken) {  
      
        
        if(err) { 
          console.log(validToken);
          return done(err); 
        }        
        if(!validToken) {  return done(null, false);  }
        if (validToken.expire < Date.now()) {  return done(null, false);   }      
        
        if (validToken.access === "A" && validToken.Scope === "/") {  return done(null, validToken, {scope: validToken.scope});  }

        // validate that token scope includes this path
        if (path.indexOf(validToken.scope) == 0) {          
          return done(null, validToken, {scope: validToken.scope});        
        };        
        
        // Check for trailing slash on path as part of scope.
        path = path + '/';
        if (path.indexOf(validToken.scope) == 0) {
          return done(null, validToken, {scope: validToken.scope});        
        };
        
        // use this if we need to create an array in the token model to support multiple paths.  Will cause latency.
 /*     var len = arr.length;
        while (len--) {
          if (req.route.path.indexOf(validToken.scope[len]) == 0) {
          // Successfuly found token and validated path is within scope.
            return done(null, validToken);
          }
        }
 */       
        // token found, but path not within scope
        return done(null, false);
      }
    
    );
  }
));

passport.serializeUser(function(user, callback) {
  callback(null, user.username);
});

passport.deserializeUser(function(id, callback) {
  // query the current user from database
  User.findOne({"username": id}
    .success(function(user){
        callback(null, user);
    }).error(function(err){
        callback(new Error('User ' + id + ' does not exist'));
    })
  );  
});

module.exports = passport;