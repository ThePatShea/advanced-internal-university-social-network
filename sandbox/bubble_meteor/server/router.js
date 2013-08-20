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
	var name = this.request.body.name;
	var ppid = this.request.body.ppid;
	var username = this.request.body.username;
	var code = this.request.body.code;
	var level = this.request.body.level;
	var userType = this.request.body.userType;
	var profilePicture = this.request.body.profilePicture;
	var retinaProfilePicture = this.request.body.retinaProfilePicture;
	var neverLoggedIn = true;

	var user = Meteor.users.findOne({'username': username});
	if(!user)
	{
		Meteor.users.insert({'username': username})
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
		'userType': userType,
		'profilePicture': profilePicture,
		'retinaProfilePicture': retinaProfilePicture,
		'firstTimeLogin': firstTimeLogin
	};
	Meteor.users.update(user._id, {$set: userProperties});

	return [200, {'username': username}, null];
});