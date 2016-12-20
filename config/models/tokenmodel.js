/*
 * KodeAPI Token Model
 */
 
var mongoose = require('mongoose');
var expire = 12;

var TokenSchema = new mongoose.Schema({
  token: {type: String, unique: true, required: true},  // generated token number
  user: {type: String, required: true},  // user name
  access: {type: String, required: true},  // W for Write, R for Read only, A for Admin
  scope: {type: String, required: true},  // path and subpaths availble for this user/token
  expire: {type: Date, default: addExpire()}
});

function addExpire() {
  var date1 = new Date();
  date1.setHours(date1.getHours() + expire);
  return date1;
}

// Export the Mongoose model
module.exports = mongoose.model('Token', TokenSchema);