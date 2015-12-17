var express = require('express'),
	session = require('express-session'),
	ejsLayouts = require('express-ejs-layouts');
	request = require('request'),
	bodyParser = require('body-parser'),
	async = require('async'),
	app = express(),
	flash = require('connect-flash'),
	db = require('./models'),
	passport = require('passport'),
	strategies = require('./config/strategies'),
	ejsLayouts = require('express-ejs-layouts');


//static directory for the views
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(ejsLayouts);
//displays error or info to the user, stored into session
app.use(flash());

app.use(session({
  secret: 'waffles are better than pancakes',
  resave: false,
  saveUninitialized: true
}));


//first middleware 
app.use(function(req, res, next) {
	if (req.session.user) {
		db.user.findById(req.session.user).then(function(user){
			req.currentUser = user;
			next();
		});
	} else {
		req.currentUser = false;
		next();
	}
});

//second middlware
app.use(function(req, res, next) {
	res.locals.currentUser = req.currentUser;//set response.locals to currentUser so we can use the currentUser object (email, name, password)in our template
	// TO DO pass alerts
	next();
});

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/', function(req, res) {
	// request({
	// 	headers: {
	// 		Accept: 'application/json',
	// 		app_id: '8d756068',
	// 		app_key: '76a1ce85406a5ce8133399c69003c5ae'
	// 	},
	// 	uri: 'https://api.infermedica.com/v1/conditions'
	// }, function(err, resp, data) {
	// 	console.log(data);
	// });
	res.render('index');
});

app.get('/conditions', function(req, res) {
	var searchQuery = req.query.q;
	request(
		{
			url  : process.env.BASE_URL + '/terms?q=' + searchQuery,
			json : true
		},
		function(err, resp, conditions){
			res.render('conditions', {conditions: conditions})
		}
	);

});

app.get('/signup', function(req, res) {
	res.render('signup');
});

app.get('/login', function(req, res) {
	res.render('login');
});

app.get('/profile', function(req, res) {
	res.render('/profile');
});

app.get('/condition', function(req, res) {


});

app.get('/condition/:id', function(req, res) {

});

app.get('/terms', function(req, res){
	var searchQuery = req.query.q;

	function getAllConditions(callback){
		var options = {
		  url: 'https://api.infermedica.com/v1/conditions',
		  headers: {
		  	'Accept'  : 'application/json',
		    'app_id'  : process.env.APP_ID,
		    'app_key' : process.env.APP_KEY
		  }
		};


		request(options, function(err, resp, body){
			callback(null, JSON.parse(body))
		});
	}

	async.series([getAllConditions], function(err, results){
		var conditionsAll = results;
		var conditionsFiltered = [];

		conditionsAll[0].forEach(function(condition){
			if(condition.name.indexOf(searchQuery) >= 0){
				conditionsFiltered.push(condition);
			}
		});

		res.send(conditionsFiltered);
	});
});


//deletes favorites
// app.delete('/favorites', function(req, res) {
//   var index = 


//   res.status(200).send('Deleted Successfully!');
// });


//load routes
// app.use('/conditions', require('./controllers/condition'));
// app.use('/favorites', require('./controllers/favorite'));
// app.use('/', require('./controllers/'));


//app.post('/login', function(req, res) {
// 	var password = req.body.password;
// 	var newPassword;
// 	bcrypt.hash(password, 10, function(err, hash) {
// 		newPassword = hash;

// 		bcrypt.compare(password, newPassword, function(err, res) {
// 			if(res === true) {
// 				res.render();//direct to new page 1
// 			} else {
// 				res.direct('/login');
// 			}r
// 		 });
// 	});
// });


// app.use(session({
//   secret: 'sasdlfkajsldfkajweoriw234234ksdfjals23',
//   resave: false,
//   saveUninitialized: true
// }));

// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(strategies.localStrategy);
// passport.use(strategies.facebookStrategy);

// passport.serializeUser(strategies.serializeUser);
// passport.deserializeUser(strategies.deserializeUser);

app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  res.locals.alerts = req.flash();
  next();
});

app.use('/auth', require('./controllers/auth.js'));


app.listen(3000);