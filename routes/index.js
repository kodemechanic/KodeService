var express = require('express');
var router = express.Router();

var passport = require('../config/passport.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Please visit the Home Page for additional infomration on Creating an Account or accessing an available API.');  
});

/* LOGIN TO API  */

router.post('/authenticate', passport.authenticate('api-basic',{session: false}),function(req,res){    
    res.status(200).send(res.req.user);  
});

module.exports = router;