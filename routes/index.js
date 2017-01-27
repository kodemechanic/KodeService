var express = require('express');
var router = express.Router();

var passport = require('../config/passport.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Hey', message: 'Hello there!' })
});

/* LOGIN TO API  */

router.post('/authenticate', passport.authenticate('api-basic',{session: false}),function(req,res){    
    res.status(200).send(res.req.user);  
});

module.exports = router;
