/* Service API */
var express = require('express');
var router = express.Router();
var mongo = require('../config/db/mongodb.js');

router.get('/', function(req, res){
  mongo.client.collections(function(err,data){
          if(err) { res.status(500).send({error: err}); }
          else {
//TODO: remove "." as a valid username character.  
            var appString = req.user + "." + req.service + ".";
            var jCollections = parseCollList(data, appString);        
            res.status(200).send({result: jCollections}); 
          }
        });          
});

function parseCollList(data, appPrefix){
  var newList = [];
  
  for (var x = 0; x < data.length; x++) {
    if (data[x].s.name.indexOf(appPrefix) === 0) {
      newList.push({name: data[x].s.name});
    }
  };
  
  return newList;
};

module.exports = router;