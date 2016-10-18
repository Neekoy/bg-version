// INACTIVE!!!

var express = require('express');
var router = express.Router();

router.get('/clientarea', ensureAuthenticated, function(req, res) {
	res.render('clientarea', { layout: 'default'});
});

router.get('/checkout', ensureAuthenticatedCheckout, function (req, res) {
	res.render('checkout', {layout: 'default'});
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

function ensureAuthenticatedCheckout(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/users/checkout-login');
	}
}

module.exports = router;