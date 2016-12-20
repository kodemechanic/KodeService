/*
 * KODEREST Collection API.
 */
 
var express = require('express');
var router = express.Router();
var mongo = require('../config/db/mongodb.js');

router.get('/', function(req, res){
  var options={};  // created array with {}, so we dont have to convert to JSON later.
  var collectionName = req.puser + "." + req.pservice + "." + req.pcollection;
  var collection = mongo.client.collection(collectionName);
  
  // Check for each reserved field name and add to options array.
  // Delete from req.query so we can reuse req.query in the call to the DB.
  if (req.query._limit){       
    options.limit = parseInt(req.query._limit);
    delete req.query._limit;      
  }
  if (req.query._skip){       
    options.skip = parseInt(req.query._skip);
    delete req.query._skip;      
  }
  if (req.query._sort){       
    options.sort = req.query._sort;
    delete req.query._sort;      
  }

  collection.find(req.query, options).toArray(function(err, docs){
    if (err) {
      res.status(500).send({error: err});
    }
    else {       
      res.status(200).send({result: docs});
    }
  });
});


router.post('/', function(req,res){
  //var serviceId = req.service.replace(/[^a-zA-Z0-9]/g, "");
  var collectionName = req.puser + "." + req.pservice + "." + req.pcollection;
  var collection = mongo.client.collection(collectionName);
  
  collection.insert(req.body, {}, function(err, docs) {
    if (err) {
      console.log(err);
      res.status(500).send({error: err});
    }
    else {
      res.status(200).send({result: docs});
    }
  })
});

router.delete('/', function(req, res){
  // CODE:  if (authenticated=='admin') { check for drop and process}    
  var collectionName = req.puser + "." + req.pservice + "." + req.pcollection;
  var collection = mongo.client.collection(collectionName);  
  
  // If passed authentication, check for drop param = true.
  if (req.query._drop_collection === "true"){
    // If _drop_collection = true, call mongo interface to drop the collection from MongoDB.

    collection.drop(function(err, docs) {
      if (err) {
        res.status(500).send({error: err});
      }
      else {
        res.status(200).send({result: docs});
      }
    });
  }
  else {
    res.status(500).send({error: "Invalid parameters, please review the API usage documentation."});
  }

});


// PUT will be used for Batch updates??

module.exports = router;
