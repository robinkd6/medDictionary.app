var 	express 				= require('express'),
			session 				= require('express-session'),
			ejsLayouts 			= require('express-ejs-layouts');
			request 				= require('request'),
			bodyParser 			= require('body-parser'),
			async 					= require('async'),
			app 						= express(),
			flash 					= require('connect-flash'),
			db 							= require('./models'),
			passport 				= require('passport'),
			LocalStrategy 	= require("passport-local"),
			User 						= require("./models/user"),
			// strategies 			= require('./config/strategies'),
			ejsLayouts 			= require('express-ejs-layouts'),
			conditionsSaved = require('./conditions.json');


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

app.get('/risks1', function(req, res) {
	res.render('risks.ejs');
});

app.get('/profile', function(req, res) {
	res.render('profile');
});


app.get('/', function(req, res) {
	var currentUser = req.currentUser;
	res.render('index', {currentUser: currentUser});
});

//condition search
app.get('/conditions', function(req, res) {
	var searchQuery = req.query.q;

	request(
		{
			url  : process.env.BASE_URL + '/terms?q=' + searchQuery,
			json : true
		},
		function(err, resp, conditions){
			res.render('conditions', {conditions: conditions});
		}
	);

});
//riskfactors search 
app.get('/riskfactors', function(req, res) {
	var searchQuery = req.query.q;
	request(
	{
		url : process.env.BASE_URL + 'risks?q=' + searchQuery,
		json : true
	},
	function(err, resp, riskfactors){
		res.send(riskfactors);
		}
	);
});

app.get('/signup', function(req, res) {
	res.render('signup');
});

app.get('/login', function(req, res) {
	res.render('login');
});




app.get('/terms', function(req, res){
	var searchQuery = req.query.q;

	function getAllConditions(callback){
		// var options = {
		//   url: 'https://api.infermedica.com/v1/conditions',
		//   headers: {
		//   	'Accept'  : 'application/json',
		//     'app_id'  : process.env.APP_ID,
		//     'app_key' : process.env.APP_KEY
		//   }
		// };

		// request(options, function(err, resp, body){
		// 	console.log(err, resp, body);
		// 	callback(null, JSON.parse(body))
		// });
		callback(null, conditionsSaved);
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

app.get('/risks', function(req, res){
	var searchQuery = req.query.q;

	function getAllRiskFactors(callback){
		var riskoptions = {
			url: 'https://api.infermedica.com/v1/risk_factors',
			headers: {
				'Accept'  : 'application/json',
				'app_id'  : process.env.APP_ID,
				'app_key' : process.env.APP_KEY
			}
		};

		request(riskoptions, function(err, resp, body) {
			callback(null, JSON.parse(body))
			console.log(JSON.parse(body));
		});

	}
console.log('hello');
	async.series([getAllRiskFactors], function(err, results) {
		var riskFactorsAll = results;
		var riskFactorsFiltered = [];

		riskFactorsAll[0].forEach(function(riskfactor) {
			if(riskfactor.name.indexOf(searchQuery) >= 0){
				riskFactorsFiltered.push(riskfactor);
			}
		});
		console.log(riskFactorsFiltered);
				// res.render('riskfactors',{riskfacktors: riskFactorsFiltered});
				res.render('riskfactors',{riskFactorsFiltered: riskFactorsFiltered});
	 });
});


app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  res.locals.alerts = req.flash();
  next();
});

app.use('/auth', require('./controllers/auth.js'));


app.listen(3000);