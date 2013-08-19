//Exposes APIs for authentication server to check if user exists
Meteor.Router.add('/usersecret','PUT',function(){
	console.log(this.request.body);
	return [307, {'Location': 'http://127.0.0.1:8000/bubbleList'}, 'testbody'];
});

/*Meteor.Router.add('/authenticateduser/:secret', 'GET', function(secret){
	var authenticatedUser = Meteor.users.findOne({'secret': secret});
	Accounts.loginWithPassword(authenticatedUser.username, 'ziggystardust1234', function(error){
		console.log('Error', error);
	});
	return [200, 'Secret: ' + secret];
});*/

Meteor.Router.add('/authenticateduser', 'POST', function(){
	//console.log(this.request.body.username, this.request.body.secret);
	var secret = this.request.body.secret;
	var username = this.request.body.username;
	var user = Meteor.users.findOne({username: this.request.body.username});
	if(!user){
		Accounts.createUser({'username': username, 'password': secret});
	};

	user = Meteor.users.findOne({username: this.request.body.username});
	Accounts.setPassword(user._id, secret);
	
	var userProperties = {
		'secret': secret
	};
	Meteor.users.update(user._id, {$set: userProperties});
	//console.log('User: ', user._id, secret);

	return [200, {'userid': user._id}, null];
});


Meteor.Router.add('/testauth', 'POST', function(){
	//console.log(this.request.body.username, this.request.body.secret);
	//var secret = this.request.body.secret;
	//var username = this.request.body.username;
	var netId = this.request.body.netId;
	var ppId = this.request.body.ppId;
	var lastName = this.request.body.lastName;
	var firstName = this.request.body.firstName;
	var isFerpa = this.request.body.isFerpa;
	var emoryEmail = this.request.body.emoryEmail;
	var altMail = this.request.body.altMail;
	var altEmail = this.request.body.altEmail;
	var secret = this.request.body.secret;

	console.log(netId, ppId, lastName, firstName, isFerpa, emoryEmail, altMail, altEmail);

	var user = Meteor.users.findOne({username: this.request.body.netId});
	if(!user){
		Accounts.createUser({'username': this.request.body.netId, 'password': 'F302pinpulse'});

		user = Meteor.users.findOne({username: this.request.body.netId});
		Accounts.setPassword(user._id, 'F302pinpulse');

		var letterProfile = '/img/letterprofiles' + this.request.body.netId.toLowerCase()[0] + '.jpg';
		
		var userProperties = {
			'profilePicture': letterProfile,
			'userType': 1,
			'ppId': ppId,
			'lastName': lastName,
			'firstName': firstName,
			'isFerpa': isFerpa,
			'emoryEmail': emoryEmail,
			'altMail': altMail,
			'altEmail': altEmail,
			'secret': secret
		}

		Meteor.users.update(user._id, {$set: userProperties});
	}
	else{
		var updatedUserProperties = {
			'ppId': ppId,
			'lastName': lastName,
			'firstName': firstName,
			'isFerpa': isFerpa,
			'emoryEmail': emoryEmail,
			'altMail': altMail,
			'altEmail': altEmail,
			'secret': secret
		}

		Meteor.users.update(user._id, {$set: updatedUserProperties});
	}


	return [200, {'body': JSON.stringify(this.request.body)}, null];
});


Meteor.Router.add('/testauth/:secret', 'GET', function(secret){
	var user = Meteor.users.findOne({'secret': secret});
	if(!user){
		if(user.secret == secret){
			var username = user.username;
			Meteor.user.loginWithPassword(username, 'F302pinpulse');
			return [200, 'Username: ' + username + '\nSecret: ' + secret];
		}
		else{
			return [302, {'Location': 'https://login.emorybubble.com'}];
		}
	}
	else{
		return [302, {'Location': 'https://login.emorybubble.com'}];
	}

	//return [302, {'Location': 'https://test.emorybubble.com'}];

	//return [200, 'Username: ' + username + '\nSecret: ' + secret];
});

/*
// Xavier: This commented-out stuff is from conflict with merge to pat branch. I didn't know what to do with it, so I commented it out so you can do what you want with it.   --Pat

 
Meteor.Router.add('/user/:username/:secret', 'GET', function(username, secret){
	return [200, 'Username: ' + username + '\nSecret: ' + secret];
});


Meteor.Router.add('/','GET', function(){
	return [307, {'Location': 'http://main.campusbubble.jit.su'}, 'null'];
});
*/

Meteor.Router.add('/pushUser', 'POST', function() {
	var email = this.request.body.email;
	var altEmail = this.request.body.altEmail;
	var username = this.request.body.username;
	var ppid = this.request.body.ppid;
	var name = this.request.body.name;
	var code = this.request.body.code;
	var level = this.request.body.level;
	var firstTimeLogin = false;

	var user = Meteor.users.findOne({username: this.request.body.username});
	if(!user)
	{
		Accounts.createUser({'username': username});
	}
	else
	{
		console.log("User already exists: " + username);
	}

	user = Meteor.users.findOne({'username': username});

	var userProperties = {
		'ppid': ppid,
		'emails': [{
			'address': email,
			'verified': false
		}],
		'altEmails': [{
			'address': altEmail,
			'verified': false
		}],
		'name': name,
		'code': code,
		'level': level,
		'firstTimeLogin': firstTimeLogin
	};
	Meteor.users.update(user._id, {$set: userProperties});

	return [200, {'username': username}, null];
});