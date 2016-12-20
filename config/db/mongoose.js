// Connect to and export connection of Mongoose

var mongoose = require('mongoose');
var configDB = {
  'url' : 'mongodb://localhost:27017/rest'  
};

var db = mongoose.connect(configDB.url);

module.exports = db.connection;