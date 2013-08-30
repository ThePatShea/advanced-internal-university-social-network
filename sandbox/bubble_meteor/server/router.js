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


Meteor.Router.add('/resetpass/:username', 'GET', function(username){
	var user = Meteor.users.findOne({'username': username});
	Accounts.setPassword(user._id, 'F302pinpulse');
	return [200, ' '];
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
		Accounts.createUser({'username': this.request.body.netId, 'password': secret});

		user = Meteor.users.findOne({username: this.request.body.netId});
		Accounts.setPassword(user._id, secret);

		var letterProfile = '/img/letterprofiles/' + this.request.body.netId.toLowerCase()[0] + '.jpg';
		
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
			'name': firstName + ' ' + lastName
			//'secret': secret
		}

    Meteor.call("addToIndex", user._id, firstName + ' ' + lastName);
		Meteor.users.update(user._id, {$set: userProperties});
	}
	else{
		Accounts.setPassword(user._id, secret);
		var updatedUserProperties = {
			'ppId': ppId,
			'lastName': lastName,
			'firstName': firstName,
			'isFerpa': isFerpa,
			'emoryEmail': emoryEmail,
			'altMail': altMail,
			'altEmail': altEmail,
			'name': firstName + ' ' + lastName
			//'secret': secret
		}

		Meteor.users.update(user._id, {$set: updatedUserProperties});
	}


	return [200, {'body': JSON.stringify(this.request.body)}, null];
});


/*Meteor.Router.add('/testauth/:username/:secret', 'GET', function(username, secret){
	var user = Meteor.users.findOne({'username': username, 'secret': secret});
	var usercount = Meteor.users.find({'username': username, 'secret': secret}).count();
	console.log(username, secret, user);
	if(usercount > 0){
		console.log('User secret checks out.');
		//Meteor.loginWithPassword(username, 'F302pinpulse');
		//return [302, {'Location': 'https://test.emorybubble.com'}];
		//return [200, 'Username: ' + username + '\nSecret: ' + secret];
		//Meteor.Router.to('/');
		Accounts.callLoginMethod({
			methodArguments: [{'user': user, 'password': 'F302pinpulse'}]
		});
		return [200, 'Username: ' + username + '\nSecret: ' + secret];
	}
	else{
		return [404];
	}

	//return [302, {'Location': 'https://test.emorybubble.com'}];

	//return [200, 'Username: ' + username + '\nSecret: ' + secret];
});*/

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
	var password = this.request.body.password;

	if(password == "pushUserPass")
	{
		var user = Meteor.users.findOne({'username': username});
		if(!user)
		{
			Meteor.users.insert({'username': username})
      var addToIndex = true;
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
			'neverLoggedIn': neverLoggedIn
		};

    if(addToIndex == true)
    {
      Meteor.call("addToIndex", user._id, name);
      console.log("ADDED TO INDEX: " + name);
    }
		Meteor.users.update(user._id, {$set: userProperties});


		return [200, "Success"];
	}
	else
	{
		return [403, "Forbidden"];
	}
});

Meteor.Router.add('/dailyDigest', 'POST', function(){
  if(this.request.body.secret == "dailyPass")
  {
    users = Meteor.users.find().fetch();
    _.each(users, function(user) {
      var retVal = "<ul>";
      var count = 0;
      if(user.neverLoggedIn == false)
      {
        updates = Updates.find({userId: user._id}).fetch();
        console.log(user._id);
        _.each(updates, function(update) {
          //console.log("user._id: " + user._id + " | update.userId: " + update.userId + " | update.emailed: " + update.emailed + " | update.content: " + update.content);
          if(update.emailed == false)
          {
            //Updates.update({_id: update._id}, {$set: {emailed: true}});
            retVal = retVal.concat("<li>" + update.content + "</li>");
            count++;
          }
        });
        retVal = retVal.concat("</ul>");
        if(retVal !== "<ul></ul>")
        {
          Meteor.call("sendDailyDigest", user._id, count, retVal);
        }
      }
    });
    return [200, "Success"];
  } else {
    return [403, "Forbidden"];
  }
});

Meteor.Router.add('/getBubbleId', 'POST', function() {
	console.log("Getting Bubble Id...");
	bubble = Bubbles.findOne({title: this.request.body.title});
	if(bubble == undefined)
	{
		var bubbleParams = {
	      category             : this.request.body.category,
	      bubbleType           : "normal",
	      description          : "",
	      title                : this.request.body.title,
	      retinaProfilePicture : "/img/Bubble-Profile.jpg",
	      retinaCoverPhoto     : "/img/Bubble-Cover.jpg",
	      profilePicture       : "/img/Bubble-Profile.jpg",
	      coverPhoto           : "/img/Bubble-Cover.jpg",
	    };
		var newBubble = _.extend(_.pick(bubbleParams, 'title', 'description', 'category', 'coverPhoto', 'retinaCoverPhoto', 'profilePicture', 'retinaProfilePicture', 'bubbleType'), {
    		submitted: new Date().getTime(),
      		lastUpdated: new Date().getTime(),
      		users: {
      			admins: [],
      			members: [],
      			invitees: [],
      			applicants: []
      		}
    	});
    	bubbleId = Bubbles.insert(newBubble);
    	if(bubbleId)
    	{
		    Meteor.call('addBubbleToIndex', bubbleId, bubble.title);
	    	return[200, bubbleId];
    	}
    	else
    	{
    		return[400, "Unsuccessful"];
    	}

	}
	else
	{
		return [200, bubble._id];
	}
	return [500, "Unsuccessful"];
});
Meteor.Router.add('/populateBubble', 'POST', function() {
	bubbleId = this.request.body.bubbleId;
	user = this.request.body.user;
	userId = "";
	type = this.request.body.type;//netId, name, email
	status = this.request.body.status;//Member, Admin, Invitee

	if(type == "netId")
	{
		tmp = Meteor.users.findOne({username: user});
		if(tmp != undefined)
		{
			userId = tmp._id;
		}
		else
		{
			return[404, "Not found: " + user]
		}
	}
	if(type == "name")
	{
		tmp = Meteor.users.findOne({name: user});
		if(tmp != undefined)
		{
			userId = tmp._id
		}
		else
		{
			return[404, "Not found: " + user]
		}
	}
	if(type == "email")
	{
		tmp = Meteor.users.findOne({$or: [{"emails.address": user},{"altEmail.address": user}]});
		if(tmp != undefined)
		{
			userId = tmp._id
		}
		else
		{
			return[404, "Not found: " + user];
		}
	}

	if(userId != "")
	{
		return [200, user + ' ' + userId + ' ' + bubbleId];
		bubble = Bubbles.findOne({_id: bubbleId});
		if(bubble == undefined)
		{
			return[404, "Bubble not found: " + bubbleId];
		}
		else
		{
			if(status == "member")
			{
				Bubbles.update({_id: bubbleId}, {$push: {"users.members": userId}});
				return[200, "Added: " + userId];
			}
			if(status == "admin")
			{
				Bubbles.update({_id: bubbleId}, {$push: {"users.admins": userId}});
				return[200, "Added: " + userId];
			}
			if(status == "invitee")
			{
				Bubbles.update({_id: bubbleId}, {$push: {"users.invitees": userId}});
				return[200, "Added: " + userId];
			}
		}
	}
	else
	{
		return [404, "Not Found: " + user];
	}
});