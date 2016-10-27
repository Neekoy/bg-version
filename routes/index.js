var express = require('express');
var router = express.Router();

// Get Homepage
router.get('/', function(req, res){
  	console.log("Sesssion ID: " + req.session.id);
	console.log("Sesssion Username: " + req.session.username + "\n");
	res.render('homepage', { layout: 'default'});
});

router.get('/cloud-hosting', function(req, res){
	res.render('cloud-hosting', { layout: 'default' });
});

router.get('/wordpress-hosting', function(req, res){
	res.render('wordpress-hosting', { layout: 'default' });
});


module.exports = router;