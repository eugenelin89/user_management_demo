// cloud.js
// Copyright (c) 2014 Eugene Lin 

// Parse Cloud Code to validdate that a user has permission to access
// resource of a given Merchant. The user is either an authorized user
// of the Merchant, or an admin of the system.


exports.validateUser = function(request, response){
	var sessionToken = request.params.sessionToken;
	var merchantCode = request.params.merchantCode;
	var merchant;
	var merchantQuery = new Parse.Query("Merchant");
	var user;
	merchantQuery.equalTo("merchantCode", merchantCode);
	merchantQuery.find().then(function(merchants){
		merchant = merchants[0];
		return Parse.User.become(sessionToken);
	}).then(function(aUser){
		user = aUser;
		var userRelation = new Parse.Relation(merchant, 'users');
		var queryUsers = userRelation.query();
		queryUsers.equalTo('objectId', user.id);
		return queryUsers.first();		

	}).then(function(result){
		if(result){
			// ok, the user is authorized for the merchant
			response.success(result);
		}else{
			// user not member of merchant, see if user is admin
			var roleQuery = new Parse.Query(Parse.Role);
			roleQuery.equalTo('name','Admin');
			roleQuery.first().then(function(role){
				var adminRelation = new Parse.Relation(role, 'users');
				var userQuery = adminRelation.query();
				userQuery.equalTo('objectId',user.id);
				return userQuery.first();
			}).then(function(result){
				if(result){
					// user is admin
					response.success(result);
				}else{
					response.error("Not Authorized")
				}
			},function(error){
				response.error(error);
			});
		}
	},function(error){
		response.error(error);
	});
}


