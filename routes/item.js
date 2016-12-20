/*
 * Item REST API.
 */
 
var express = require('express');
var router = express.Router();
var mongo = require('../config/db/mongodb.js');
var ObjectID = require('mongodb').ObjectID;

router.get('/', function(req, res){
  
  var collectionName = req.puser + "." + req.pservice + "." + req.pcollection;  
  var collection = mongo.client.collection(collectionName);
  
  collection.findOne({_id: new ObjectID(req.pitem)}, {}, function(err, doc){    
    if (err) {            
      res.status(500).send({error: err});
    }
    else {      
      res.status(200).send({result: doc});     
    }
  });        
});

router.post('/', function(req,res){
  var collectionName = req.puser + "." + req.pservice + "." + req.pcollection;
  var collection =  mongo.client.collection(collectionName);

  collection.updateOne({_id: new ObjectID(req.pitem)}, {$set:req.body}, {w:1, safe:true, multi:false}, function(err, doc){
    if (err) {
      res.status(500).send({error: err});
    }
    else {
      res.status(200).send({result: doc});
    }
  })
});

router.put('/', function(req,res){
  var collectionName = req.puser + "." + req.pservice + "." + req.pcollection;
  var collection =  mongo.client.collection(collectionName);
  
  collection.updateOne({_id: new ObjectID(req.pitem)}, {$set:req.body}, function(err, doc){
    if (err) {
      res.status(500).send({error: err});
    }
    else {
      res.status(200).send({result: doc});
    }
  })
});

router.delete('/', function(req,res){
  var collectionName = req.puser + "." + req.pservice + "." + req.pcollection;
  var collection =  mongo.client.collection(collectionName);

  collection.deleteOne({_id: new ObjectID(req.pitem)},function(err, doc){  
      if (err) {
        res.status(500).send({error: err});
      }
      else {
        res.status(200).send({result: doc});        
      }
  })    
});

module.exports = router;
