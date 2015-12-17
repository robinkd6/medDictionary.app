// var express = require('express');
// var db = require('./../models');
// var router = express.Router();

// router.post('/', function(req, res) {
// 	db.favorite.findOrCrete({
// 		where: {
// 			medical_id: req.body.medical_id
// 		}, 
// 		defaults: {
// 			//code inside

// 		}
// 	}).spread(function(favorite, created) {
// 		console.log(favorite.get());
// 		res.redirect('/');
// 	});
// });
// //show favorites
// router.get('/', function(req, res) {
// 	db.favorite.findAll({
// 		order: 'title ASC'
// 	}).then(function(favorites) {
// 		res.render('favorites/index', {favorites: favorites});
// 	});
// });

// router.delete('/', function(req, res) {
//   db.favorite.destroy({
//     where: {
      
//     }
//   }).then(function() {
//     res.send({'msg': 'success'});
//   }).catch(function(e) {
//     res.send({'msg': 'error', 'error': e});
//   });
// });

