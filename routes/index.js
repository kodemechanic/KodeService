var express = require('express');
var router = express.Router();

var passport = require('../config/passport.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'KodeMechanic KodeAPI'})
});

module.exports = router;
