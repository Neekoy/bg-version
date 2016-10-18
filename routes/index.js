var express = require('express');
var router = express.Router();

// Get Homepage
router.get('/', function(req, res){
  	console.log("Sesssion ID: " + req.session.id);
	console.log("Sesssion Username: " + req.session.username + "\n");
	res.render('homepage', { layout: 'default'});
});

router.post('/addtocart', function(req, res){
	console.log(req);
	res.locals.inCart = 100;
});

module.exports = router;