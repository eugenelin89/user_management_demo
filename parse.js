// parse.js
// Copyright (c) 2014 Eugene Lin

// Node.js code in a MEAN Stack that communicates with Parse to 
// validate with a session token that the user with the session token
// has the permission to access a Merchant resource.

var https      = require('https');
var Promise    = require('promise');

// In real life, don't put this here....
var APPLICATION_ID = "[YOUR PARSE APPLICATION ID]";  
var API_KEY = "[YOUR PARSE REST API KEY]"; 

exports.validateUserForMerchant = function(sessionToken, merchantCode){
	var promise = new Promise(function(resolve, reject){
		var options = {
			host:"api.parse.com",
			path:"/1/functions/validateUser",
			method:"POST",
			headers:{
				"X-Parse-Application-Id":APPLICATION_ID,
				"X-Parse-REST-API-Key":API_KEY,
				"Content-Type":"application/json"
			},	
		};

		var postData = {
			"sessionToken":sessionToken,
			"merchantCode":merchantCode,
		};
		
		var post_req = https.request(options, function(res) {
			console.log("statusCode: ", res.statusCode);
  			console.log("headers: ", res.headers);

			res.setEncoding('utf8');
			res.on('data', function (chunk) {
				if(res.statusCode == 200){
					resolve(chunk);
				}else{
					reject(chunk);
				}	
			});
		});


		post_req.on('error', function(e) {
			reject(e.message);
		});

		var data = JSON.stringify(postData);
		post_req.write(data);
		post_req.end();
	});

	return promise;
}

