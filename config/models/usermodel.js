/*
 *  KodeAPI User Model
 */ 

// load required modules

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var UserInfoSchema = new mongoose.Schema({
  firstName: {type: String},
  lastName: {type: String},
  address: {type: String},
  city: {type: String},
  state: {type: String},
  zip: {type: String},
  country: {type: String},
  phone: {type: String},
  website: {type: String},
  notes: {type: String}
});

var AppSchema = new mongoose.Schema({
  appid: {type: String},  
  appname: {type: String},    
  appdesc: {type: String},
  secret: {type: String}
});

var ClientSchema = new mongoose.Schema({
  clientID: {type: String},
  clientName: {type: String},
  password: {type: String},
  accesslevel: {type: String},
  clientContact: {type: String},  
  email: {type: String},
  phone: {type: String},
  website: {type: String},
  clientNotes: {type: String},
  metadata: {type: String},
  secret: {type: String}
});

//  Define schema for user
var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  userid: {
    type: String,
    required: true,
    unique: true
  },  
  password: {
    type: String,
    required: true
  },
  accesslevel: {
    type: String,
    required: true
  },
  userinfo: [UserInfoSchema],
  apps: [AppSchema],
  clients: [ClientSchema]
});

// execute before each user.save() call
UserSchema.pre('save', function(callback) {
  var user = this;
  
  // break out of pw not changed.
  if (!user.isModified('password')) return callback();
  
  // Password changed so we need to hash it
  bcrypt.genSalt(5, function(err, salt){
    if (err) return callback(err);
    
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return callback(err);
      user.password = hash;
      callback();
    });
  });      
});

UserSchema.methods.verifyPassword = function(password, callback) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if(err)  { return callback(err); }
    callback(null, isMatch);
  });
};

// Export the model
module.exports = mongoose.model('User', UserSchema);