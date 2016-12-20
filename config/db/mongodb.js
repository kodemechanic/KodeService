var mongodb = require('mongodb');

module.exports.init = function (callback) {
  var server = new mongodb.Server("localhost", 27017, {});
  new mongodb.Db('rest', server, {w:1}).open(function (err, client) {
    // export the client as a shortcut.  Collection exported as example for later use...
    module.exports.client = client;    
    module.exports.myColl = client.collection('users');
    callback(err);
  });
 };