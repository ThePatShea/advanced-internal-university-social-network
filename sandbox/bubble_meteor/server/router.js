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

Meteor.Router.add('/getBubbleId/:bubbleName', 'POST', function(bubbleName) {
	//console.log("Getting Bubble Id...");
	var data = this.request.body;
	var bubble = Bubbles.findOne({title: data.bubbleName});
	if(bubble == undefined)
	{
		var bubbleParams = {
	      category             : data.bubbleType,
	      bubbleType           : "normal",
	      description          : "",
	      title                : data.bubbleName,
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
		    Meteor.call('addBubbleToIndex', bubbleId, data.bubbleName);
		    data.bubbleId = bubbleId;
	    	//return[200, bubbleId];
    	}
    	else
    	{
    		return[400, "Unsuccessful"];
    	}

	}
	else
	{
		data.bubbleId = bubble._id;
		//return [200, bubble._id];
	}
	return [200, JSON.stringify(data)];
});
/*
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
*/

Meteor.Router.add('/populateBubble/:bubbleId', 'POST', function(bubbleId) {
	//console.log("popbub: " + JSON.stringify(this.request.body));
	var data = this.request.body;
	var tmp;
	//console.log("Members in " + bubbleId + ":");
	_.each(data.members, function(member) {
		if(member.type == "NetID")
		{
			var netId = member.user.toUpperCase();
			var user = Meteor.users.findOne({username: netId});
			if(typeof user != "undefined")
			{
				Bubbles.update({_id: bubbleId}, {$push: {"users.members": user._id}});
			}
			else
			{
				console.log("USER NOT FOUND: " + netId);
			}
		}
		else if(member.type == "Name")
		{
			var name = member.user;
			var count = Meteor.users.find({name: name}).count();
			if(count == 1)
			{
				var user = Meteor.users.findOne({name: name});
				if(typeof user != "undefined")
				{
					Bubbles.update({_id: bubbleId}, {$push: {"users.members": user._id}});
				}
				else
				{
					console.log("USER NOT FOUND: " + name);
				}
			}
			if(count > 1)
			{
				console.log("Multiple users named: " + name);
			}
			if(count < 1)
			{
				console.log("User not found: " + name);
			}
		}
		else if(member.type == "Email")
		{
			var email = member.user;
			var user = Meteor.users.findOne({$or: [{"emails.address": email},{"altEmails.address": email},{"email.address": email},{"altEmail.address": email}]});
			if(typeof user != "undefined")
			{
				Bubbles.update({_id: bubbleId}, {$push: {"users.members": user._id}});
			}
			else
			{
				console.log("USER NOT FOUND: " + email);
			}
		}
		else
		{
			console.log("Type (" + member.type + ") not recognized for: " + member.user);
		}
	});
	//console.log("Admins in " + bubbleId + ":");
	_.each(data.admins, function(admin) {
				if(admin.type == "NetID")
		{
			var netId = admin.user.toUpperCase();
			var user = Meteor.users.findOne({username: netId});
			if(typeof user != "undefined")
			{
				Bubbles.update({_id: bubbleId}, {$push: {"users.admins": user._id}});
			}
			else
			{
				console.log("USER NOT FOUND: " + netId);
			}
		}
		else if(admin.type == "Name")
		{
			var name = admin.user;
			var count = Meteor.users.find({name: name}).count();
			if(count == 1)
			{
				var user = Meteor.users.findOne({name: name});
				if(typeof user != "undefined")
				{
					Bubbles.update({_id: bubbleId}, {$push: {"users.admins": user._id}});
				}
				else
				{
					console.log("USER NOT FOUND: " + name);
				}
			}
			if(count > 1)
			{
				console.log("Multiple users named: " + name);
			}
			if(count < 1)
			{
				console.log("User not found: " + name);
			}
		}
		else if(admin.type == "Email")
		{
			var email = admin.user;
			var user = Meteor.users.findOne({$or: [{"emails.address": email},{"altEmails.address": email},{"email.address": email},{"altEmail.address": email}]});
			if(typeof user != "undefined")
			{
				Bubbles.update({_id: bubbleId}, {$push: {"users.admins": user._id}});
			}
			else
			{
				console.log("USER NOT FOUND: " + email);
			}
		}
		else
		{
			console.log("Type (" + admin.type + ") not recognized for: " + admin.user);
		}
	});
	//console.log("Invitees in " + bubbleId + ":");
	_.each(data.invitees, function(invitee) {
				if(invitee.type == "NetID")
		{
			var netId = invitee.user.toUpperCase();
			var user = Meteor.users.findOne({username: netId});
			if(typeof user != "undefined")
			{
				Bubbles.update({_id: bubbleId}, {$push: {"users.invitees": user._id}});
			}
			else
			{
				console.log("USER NOT FOUND: " + netId);
			}
		}
		else if(invitee.type == "Name")
		{
			var name = invitee.user;
			var count = Meteor.users.find({name: name}).count();
			if(count == 1)
			{
				var user = Meteor.users.findOne({name: name});
				if(typeof user != "undefined")
				{
					Bubbles.update({_id: bubbleId}, {$push: {"users.invitees": user._id}});
				}
				else
				{
					console.log("USER NOT FOUND: " + name);
				}
			}
			if(count > 1)
			{
				console.log("Multiple users named: " + name);
			}
			if(count < 1)
			{
				console.log("User not found: " + name);
			}
		}
		else if(invitee.type == "Email")
		{
			var email = invitee.user;
			var user = Meteor.users.findOne({$or: [{"emails.address": email},{"altEmails.address": email},{"email.address": email},{"altEmail.address": email}]});
			if(typeof user != "undefined")
			{
				Bubbles.update({_id: bubbleId}, {$push: {"users.invitees": user._id}});
			}
			else
			{
				console.log("USER NOT FOUND: " + email);
			}
		}
		else
		{
			console.log("Type (" + invitee.type + ") not recognized for: " + invitee.user);
		}
	});
	return [200, "Success"];
});

Meteor.Router.add('/bubbleanalytics','GET', function() {
	var retVal = {};

	start = this.request.query.start;
	if((typeof start !== "undefined") && (start != ""))
	{
		startYear = start.substring(0,start.indexOf("-"));
		startMonth = start.substring(start.indexOf("-")+1,start.indexOf("-", start.indexOf("-")+1));
		startDay = start.substring(start.indexOf("-", start.indexOf("-")+1)+1);
		startDate = new Date(startYear, startMonth-1, startDay);
		console.log("Start: " + startDate.toDateString());
	}
	else
	{
		startDate = new Date(0);
		console.log("ZERO HOUR: " + startDate.toDateString());
	}

	end = this.request.query.end;
	if((typeof end !== "undefined") && (end != ""))
	{
		endYear = end.substring(0,end.indexOf("-"));
		endMonth = end.substring(end.indexOf("-")+1,end.indexOf("-", end.indexOf("-")+1));
		endDay = end.substring(end.indexOf("-", end.indexOf("-")+1)+1);
		endDate = new Date(endYear, endMonth-1, endDay);
		console.log("End: " + endDate.toDateString());
	}
	else
	{
		endDate = new Date();
		console.log("NOW: " + endDate.toDateString());
	}

	retVal.startDate = startDate.toDateString();
	retVal.endDate = endDate.toDateString();
	retVal.data = [];

	users = Meteor.users.find({neverLoggedIn: false}, {fields: {_id: 1, username: 1, name: 1, level: 1}});
	users.forEach(function(user)
	{
		var logcount = 0;
		var postcount = 0;
		userlogs = Userlogs.find({userId: user._id, login: true});
		userlogs.forEach(function(userlog)
		{
			if((userlog.submitted >= startDate.getTime()) && (userlog.submitted <= endDate.getTime()))
			{
				logcount++;
			}
		});
		posts = Posts.find({userId: user._id});
		posts.forEach(function(post)
		{
			if((post.submitted >= startDate.getTime()) && (post.submitted <= endDate.getTime()))
			{
				postcount++;
			}
		});
		// console.log("Name: " + user.name + " | Username: " + user.username + " | Level: " + user.level);
		// console.log("Analytics between: " + startDate.toDateString() + " and " + endDate.toDateString());
		// console.log("Login Count: " + logcount);
		// console.log("Post Count: " + postcount);
		tmp = {
			name: user.name,
			username: user.username,
			level: user.level,
			loginCount: logcount,
			postCount: postcount
		};
		retVal.data.push(tmp);
	});
	console.log(retVal);
	return(200, JSON.stringify(retVal));
});


Meteor.Router.add('/mybubbles/:id/emails','GET', function(id) {
	var bubble = Bubbles.findOne({_id: id});
	members = [];
	invitees = [];
	for(i in bubble.users.members)
	{
		var user = Meteor.users.findOne({_id: bubble.users.members[i]});
		members = members.concat(user.emails[0].address);
	}
	for(i in bubble.users.invitees)
	{
		var user = Meteor.users.findOne({_id: bubble.users.invitees[i]});
		invitees = invitees.concat(user.emails[0].address);
	}
	return(200, "Members: " + members.toString() + "\nInvitees: " + invitees.toString());
});