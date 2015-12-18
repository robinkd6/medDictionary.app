var db = require('../models');
var express = require('express');
var router = express.Router();

router.get('/signup', function(req, res) {
	res.render('signup');
});

router.post('/signup', function(req, res) {
	if (req.body.password != req.body.password2) {
		req.flash('danger', 'Passwords do not match!');
		res.redirect('signup');
	} else {
		db.user.findOrCreate({
			where: {
				email: req.body.email
			},
			defaults: {
				email: req.body.email,
				password: req.body.password,
				firstName: req.body.firstName,
				lastName: req.body.lastName
			}
		}).spread(function(user, created) {
			if (created) {
				res.redirect('/');
			} else {
				req.flash('danger', 'Email already exists!');
				res.redirect('signup');
			}
		}).catch(function(err) {
			if (err.message) {
				// TODO error reporting
			} else {
				console.log(err);
			}
			res.redirect('signup');
		});
	}
});

router.get('/login', function(req, res) {
	res.render('login');
})

router.post('/login', function(req, res) {
	db.user.authenticate(req.body.email, req.body.password, function(err, user) {
		if (err) { // if callback passes an error message
		} else if (user) { // if callback passes a user object
			req.session.user = user.id;
			res.redirect('/');

		} else { // if callback passes a false
			// Invalid username or password error TODO
			req.flash('danger', 'Invalid email or password')
			res.redirect('login');
		}
	});
});

router.get('/logout', function(req, res) {
	// TODO send logout message
	req.logout();
	req.flash('info', 'You have been logged out.');
 	res.redirect('/');
});

module.exports = router;