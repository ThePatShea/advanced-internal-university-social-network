var crypto = Npm.require('crypto');

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
	//Accounts.setPassword(user._id, 'F302pinpulse');
	var randString = randomString(20);
	Accounts.setPassword(user._id, randString);
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

Meteor.Router.add('/newLogin/newUser', 'POST', function(){
	/*
	0) save all this.request.body params into vars
	1) check email domain against var array
	1.5) TODO: check against mongo collection
	2) check that passwords match
	3) create vToken
	4) create user
	5) update user (including vToken attr)
	6) send verification email
	7) return 200
	*/

	//var domains = ['thecampusbubble.com','emorybubble.com'];

	var email = this.request.body.email;
	var type = this.request.body.type;
	var pass1 = this.request.body.pass1;
	var pass2 = this.request.body.pass2;
	var name = this.request.body.name;

	var domain = email.split('@')[1];

	var hash = crypto.createHash('md5');
	var hashData = JSON.stringify(this.request.body);
	hash.update(hashData);
	var vToken = hash.digest('hex');

	console.log("email: ", email);
	console.log("type: ", type);
	console.log("pass1: ", pass1);
	console.log("pass2: ", pass2);
	console.log("name: ", name);
	console.log("vToken: ", vToken);

	var foundDomain = Domains.findOne({domain: domain});

	//if(_.contains(domains,domain)) {
	if(typeof foundDomain !== "undefined") {
		var user = Meteor.users.findOne({username: email});

		console.log("USER: ", user);

		if(typeof user === "undefined") {
			if(pass1 === pass2) {
				if((typeof email !== "undefined") && (typeof pass1 !== "undefined") && (typeof name !== "undefined")) {
					var uid = Accounts.createUser({
						username: email,
						email: email,
						password: pass1
					});

					Meteor.users.update({_id: uid},{
						$set:
						{
							name: name,
							userType: '1',
							profilePicture: '/img/letterprofiles/'+name.substring(0,1).toLowerCase()+'.jpg',
							retinaProfilePicture: '/img/letterprofiles/'+name.substring(0,1).toLowerCase()+'.jpg',
							vToken: vToken,
							type: type	
						}
					});
				} else {
					return ['500', "All required fields were not present"];
				}
			} else {
				return ['500',"Password fields did not match"];
			}
		} else {
			return ['500',"This user already exists"];
		}
	} else {
		return ['500',"This Email Domain is not on the approved list"];
	}

	console.log("UID: ", uid);

    Meteor.call("addToIndex", uid, name);

    Meteor.call("sendBetaVerify",email,vToken,name,"GT");

	return ['200',vToken];

});

Meteor.Router.add('/newLogin/checkVerified/:email','GET', function(email) {
	/*
	1) find user
	2) loop through email addresses
	3) return 200 if true
	4) return 500 if false
	*/

	var user = Meteor.users.findOne({username:email});

	if(user) {
		for(i in user.emails) {
			userEmail = user.emails[i];

			if(userEmail.address === email) {
				if(userEmail.verified === true) {
					return ['200',"True"];
				} else {
					return ['500', "Email address is not verified, please check your email for verification link"];
				}
			}
		}
	} else {
		return ['500', "Could not find user in database"];
	}
	
	return ['500',"False"];
});

Meteor.Router.add('/newLogin/verifyEmail','POST', function() {
	/*
	1) find user where vToken === vToken
	2) find email where address === email
	3) verified = true
	4) return 200
	*/

	var email = this.request.body.email;
	var vToken = this.request.body.vToken;

	console.log('vToken: ', vToken);

	if(vToken) {
		var user = Meteor.users.findOne({vToken: vToken});
	}

	console.log("user", user);

	if(user) {
		for(i in user.emails) {
			userEmail = user.emails[i];

			if(userEmail.address === email) {
				Meteor.users.update({'vToken':vToken,'emails.address': email},{$set: {'emails.$.verified': true}});
				return ['200',"Verified"];
			}
		}
		return ['500', "This email address does not match this verification code, please check your inbox for a verification link"];
	} else {
		return ['500', "This verification code is not valid"];
	}

	return ['500',"Not verified"];
});

Meteor.Router.add('/newLogin/inviteMembers','POST', function() {
	/*
	1) split this.request.body.emailString
	2) check all endings against collection of accepted domains
	3) send emails with /signUp?email=:email
	*/

	var emails = this.request.body.emailString.split(',') || [];
	var fromName = this.request.body.fromName || "A Campus Bubble user";

	var rejectedEmails = [];

	for(i in emails) {
		var domain = emails[i].split('@')[1];
		var foundDomain = Domains.findOne({domain: domain});

		if(typeof foundDomain !== "undefined") {
			Meteor.call('sendBetaInvite',emails[i],fromName,'GT');
		} else {
			rejectedEmails.push(emails[i]);
		}
	};

	if(rejectedEmails.length == 0)
		return ['200','Success'];
	else if(rejectedEmails.length < emails.length)
		return ['207',"Rejected: " + rejectedEmails.toString()]
	
	return ['500','Unsuccessful']
});

Meteor.Router.add('/newLogin/addDomains','POST',function() {
	/*
	1) split this.request.body.domainString
	2) pull array from Domains collection?
	3) check to see if posted domains are in colleciton already
	4) $addToSet new domains
	*/

	var domainString = this.request.body.domainString;
	var domainArray = domainString.split(',');

	var foundDomain = Domains.findOne({domain: {$in: domainArray}});

	if(typeof foundDomain === "undefined") {
		for(i in domainArray) {
			Domains.insert({domain: domainArray[i]});
		}
		return ['200',domainString];
	} else {
		return ['500',JSON.stringify(foundDomain.domain) + " is already in the system"];
	}

	return ['500',"Unsuccessful"];
});

Meteor.Router.add('/newUser', 'POST', function(){
	var username = this.request.body.username;
	var password = this.request.body.password;
	var email = this.request.body.email;
	var name = this.request.body.name;
	var secret = this.request.body.secret;

	console.log("Username: ", username);
	console.log("Password: ", password);
	console.log("Email: ", email);
	console.log("Name: ", name);
	console.log("Secret: ", secret);

	var uid = "";

	if(secret !== "superSecret")
	{
		return ['403', "FORBIDDEN"];
	}

	if(Meteor.users.findOne({username: username}) != undefined)
	{
		return ['500', "User Exists"];
	}

	if((typeof username !== "undefined") && (typeof password !== "undefined") && (typeof name !== "undefined"))
	{
		if(typeof email !== "undefined")
		{
			var uid = Accounts.createUser({
				username: username,
				email: email,
				password: password
			});
		}
		else
		{
			var uid = Accounts.createUser({
				username: username,
				password: password
			});
		}

		Meteor.users.update({_id: uid},{
			$set:
			{
				name: name,
				userType: '1',
				profilePicture: '/img/letterprofiles/'+name.substring(0,1).toLowerCase()+'.jpg',
				retinaProfilePicture: '/img/letterprofiles/'+name.substring(0,1).toLowerCase()+'.jpg',			
			}
		});
	}

	console.log("UID: ", uid);


    Meteor.call("addToIndex", uid, name);

	return ['200',uid];
});

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
    //users = Meteor.users.find().fetch();
    users = Meteor.users.findOne({username: "GHOBBIN"});
    console.log("GIO: ", users);
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



function randomString(stringLength){
	var characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()';
	var numCharacters = characters.length;
	var randString = '';
	for(var i=0; i < stringLength; i++){
		randString = randString + characters[Math.round(Math.random()*(characters.length-1))];
	}

	return randString;
}
