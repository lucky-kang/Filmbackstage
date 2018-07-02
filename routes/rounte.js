var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
   home : res.render({ title: 'home' });
   cart : res.render({ title: 'cart' });
   page404 : res.render({ title: 'page404' });
});

module.exports = router;