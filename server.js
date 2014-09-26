// server.js
// Copyright (c) 2014 Eugene Lin

// BASE SETUP
// =============================================================================

// call the packages we need
var express     = require('express'); 		// call express
var app         = express(); 				// define our app using express
var bodyParser  = require('body-parser');
var logfmt      = require('logfmt');
var Parse       = require('./parse');

// logging
app.use(logfmt.requestLogger());

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8082; 		// set our port
var router = express.Router(); 				// get an instance of the express Router





// ROUTES FOR OUR API
// =============================================================================

router.route('/deals')
	// Create a Deal
	.post(function(req, res){
		var sessionToken = req.header("X-Chop-User-Session-Token");
		var merchantCode = req.body.merchant_id;
		Parse.validateUserForMerchant(sessionToken, merchantCode).then(function(result){
			// --- Deal Creation Code ---
			console.log("Validating Permission...");
			res.send("OK")
		},function(error){
			res.status(400).send(error);
		});
	});




// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api/v1', router);


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
