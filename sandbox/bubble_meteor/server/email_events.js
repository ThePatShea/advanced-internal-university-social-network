Meteor.methods({
	sendFlagEmail: function(flag) {
		var bubble = Bubbles.findOne({_id: flag.bubbleId});
		var post = Posts.findOne({_id: flag.postId});
		var moderatorList = Meteor.users.find({'userType': '3'}).fetch();
		var to = [];
		_.each(moderatorList, function(i) {
			to.push({"email": i.emails[0].adddress, "name": "Bubble Moderator"});
		});
		//var retVal = {'invokerId': flag.invokerId, 'invokerName': flag.invokerName, 'bubbleId': flag.bubbleId, 'bubbleName': bubble.name, 'postId': flag.postId, 'to': to.toString()};
		var invokerId = flag.invokerId;
		var invokerName = flag.invokerName;
		var bubbleId = flag.bubbleId;
		var bubbleName = bubble.title;
		var postId = flag.postId;
		var postName = post.name;
		var retVal = {
			"key": "LiWfSyjL9OhYPdAdA28I7A",
			"template_name": "cb-flag-email",
			"template_content": [],
			"headers": {
            	"Content-Type": "application/json"
        	},
			"message":
			{
			    "to": to,
			    "global_merge_vars": [
			        {
			            "name": "INVOKERID",
			            "content": invokerId
			        },
			       	{
			        	"name": "INVOKERNAME",
			        	"content": invokerName
			       	},
			       	{
			        	"name": "BUBBLEID",
			        	"content": bubbleId
			       	},
			       	{
			        	"name": "BUBBLENAME",
			        	"content": bubbleName
			       	},
			       	{
			        	"name": "POSTID",
			        	"content": postId
			       	},
			       	{
			        	"name": "POSTNAME",
			        	"content": postName
			       	}
			    ],
			    tags: ["sendFlagEmail"],
			    track_opens: true,
			    track_clicks: true
			}
		};

		console.log(JSON.stringify(retVal));

		Meteor.http.post("https://mandrillapp.com/api/1.0/messages/send-template.json",//http://httpbin.org/post",
			{"data": retVal},
			function(err, res) {
				console.log(res);
			}
		);
	},
	sendWelcomeEmail: function(userId) {
		var user = Meteor.users.findOne({_id: userId});
		var name = user.name;
		var fname = user.name.substring(0,user.name.indexOf(' '));
		var to = user.emails[0].address;
		//console.log("SENT TO: " + to + " | NAME: " + name + " | USERID: " + userId);
		var retVal = {
			"key": "LiWfSyjL9OhYPdAdA28I7A",
			"template_name": "cb-welcome-email",
			"template_content": [],
			"headers": {
            	"Content-Type": "application/json"
        	},
			"message":
			{
			    "to": [
			        {
			          "email": to,
			          "name": name
			        }
			    ],
			     "global_merge_vars": [
			        {
			            "name": "NAME",
			            "content": name
			        },
			       	{
			        	"name": "FNAME",
			        	"content": fname
			       	},
			       	{
			        	"name": "USERID",
			        	"content": userId
			       	}
			    ],
			    tags: ["sendWelcomeEmail"],
			    track_opens: true,
			    track_clicks: true
			}
		};

		console.log(JSON.stringify(retVal));

		Meteor.http.post("https://mandrillapp.com/api/1.0/messages/send-template.json",//http://httpbin.org/post",
			{data: retVal},
			function(err, res) {
				console.log(res);
			}
		);
	},
	sendInvitedEmail: function(currentUserId, userId, bubbleId) {
		var currentUser = Meteor.users.findOne({_id: currentUserId});
		var user = Meteor.users.findOne({_id: userId});
		var bubble = Bubbles.findOne({_id: bubbleId});
		var currentUserName = currentUser.name;
		var name = user.name;
		var fname = user.name.substring(0,user.name.indexOf(' '));
		var bubbleName = bubble.title;
		var to = user.emails[0].address;
		if(typeof to == undefined)
		{
			return "No Email Address for invited user";
		}
		//var retVal = {'currentUserId': currentUserId, 'currentUserName': currentUser.name, 'userId': userId, 'bubbleId': bubbleId, 'name': user.name, 'bubbleName': bubble.title, 'to': user.emails[0].address};
		var retVal = {
			"key": "LiWfSyjL9OhYPdAdA28I7A",//c4HA5dUtFK1IjN01VjjBKw
			"template_name": "cb-invited-email",
			"template_content": [],
			"headers": {
            	"Content-Type": "application/json"
        	},
			"message":
			{
			    "to": [
			        {
			          "email": to,
			          "name": name
			        }
			    ],
			     "global_merge_vars": [
			        {
			            "name": "INVITERID",
			            "content": currentUserId
			        },
			       	{
			        	"name": "INVITERNAME",
			        	"content": currentUserName
			       	},
			       	{
			        	"name": "INVITEEID",
			        	"content": userId
			       	},
			       	{
			        	"name": "INVITEENAME",
			        	"content": name
			       	},
			       	{
			        	"name": "INVITEEFNAME",
			        	"content": fname
			       	},
			       	{
			        	"name": "BUBBLEID",
			        	"content": userId
			       	},
			       	{
			        	"name": "BUBBLENAME",
			        	"content": bubbleName
			       	}
			    ],
			    tags: ["sendInvitedEmail"],
			    track_opens: true,
			    track_clicks: true
			}
		};

		console.log(JSON.stringify(retVal));

		Meteor.http.post("https://mandrillapp.com/api/1.0/messages/send-template.json",//http://httpbin.org/post",
			{"data": retVal},
			function(err, res) {
				console.log(res);
			}
		);
	},
	sendApplicantEmail: function(userId, bubbleId) {
		var user = Meteor.users.findOne({_id: userId});
		var bubble = Bubbles.findOne({_id: bubbleId});
		var adminIds = bubble.users.admins;
		var name = user.name;
		var bubbleName = bubble.title;
		var to = [];

		_.each(adminIds, function(i) {
			tmp = Meteor.users.findOne({_id: i});
			to.push({"email": tmp.emails[0].address, "name": "Bubble Admin"});
		});
		var retVal = {
			"key": "LiWfSyjL9OhYPdAdA28I7A",
			"template_name": "cb-applicant-email",
			"template_content": [],
			"headers": {
            	"Content-Type": "application/json"
        	},
			"message":
			{
			    "to": to,
			     "global_merge_vars": [
			        {
			            "name": "USERID",
			            "content": userId
			        },
			       	{
			        	"name": "NAME",
			        	"content": name
			       	},
			       	{
			        	"name": "BUBBLEID",
			        	"content": bubbleId
			       	},
			       	{
			        	"name": "BUBBLENAME",
			        	"content": bubbleName
			       	}
			    ],
			    tags: ["sendApplicantEmail"],
			    track_opens: true,
			    track_clicks: true
			}
		};

		console.log(JSON.stringify(retVal));

		Meteor.http.post("https://mandrillapp.com/api/1.0/messages/send-template.json",//http://httpbin.org/post",
			{"data": retVal},
			function(err, res) {
				console.log(res);
			}
		);
	},
	sendDailyDigest: function(userId, numUpdates, content) {
		console.log("Daily Digest");
		var user = Meteor.users.findOne({_id: userId});
		var to = user.emails[0].address;
		var name = user.name;//.substring(0,user.name.indexOf(" "));
		var retVal = {
			"key": "LiWfSyjL9OhYPdAdA28I7A",
			"template_name": "cb-daily-digest",
			"template_content": [],
			"headers": {
            	"Content-Type": "application/json"
        	},
			"message":
			{
			    "to": [
			        {
			          "email": to,
			          "name": name
			        }
			    ],
			     "global_merge_vars": [
			        {
			            "name": "USERID",
			            "content": userId
			        },
			       	{
			        	"name": "NAME",
			        	"content": name
			       	},
			       	{
			       		"name": "NUMUPDATES",
			       		"content": numUpdates
			       	},
			       	{
			        	"name": "CONTENT",
			        	"content": content
			       	}
			    ],
			    tags: ["dailyDigest"],
			    track_opens: true,
			    track_clicks: true
			}
		};

		console.log(JSON.stringify(retVal));

		Meteor.http.post("https://mandrillapp.com/api/1.0/messages/send-template.json",//http://httpbin.org/post",
			{"data": retVal},
			function(err, res) {
				console.log(res);
			}
		);
	},
	sendBetaInvite: function(emailAddress,fromName,school) {
		var fromName = fromName;
		var to = emailAddress;
		var school = school;
		//console.log("SENT TO: " + to + " | NAME: " + name + " | USERID: " + userId);
		var retVal = {
			"key": "LiWfSyjL9OhYPdAdA28I7A",
			"template_name": "beta-invite",
			"template_content": [],
			"headers": {
            	"Content-Type": "application/json"
        	},
			"message":
			{
			    "to": [
			        {
			          "email": to,
			          "name": to
			        }
			    ],
			     "global_merge_vars": [
			       	{
			        	"name": "FROMNAME",
			        	"content": fromName
			       	},
			       	{
			        	"name": "EMAIL",
			        	"content": emailAddress
			       	},
			       	{
			        	"name": "SCHOOL",
			        	"content": school
			       	}
			    ],
			    tags: ["beta-invite"],
			    track_opens: true,
			    track_clicks: true
			}
		};

		console.log(JSON.stringify(retVal));

		Meteor.http.post("https://mandrillapp.com/api/1.0/messages/send-template.json",//http://httpbin.org/post",
			{data: retVal},
			function(err, res) {
				console.log(res);
			}
		);
	},
	sendBetaVerify: function(emailAddress,vToken,name,school) {
		var to = emailAddress;
		var vToken = vToken;
		var name = name;
		var school = school;

		var retVal = {
			"key": "LiWfSyjL9OhYPdAdA28I7A",
			"template_name": "beta-verify",
			"template_content": [],
			"headers": {
            	"Content-Type": "application/json"
        	},
			"message":
			{
			    "to": [
			        {
			          "email": to,
			          "name": name
			        }
			    ],
			     "global_merge_vars": [
			       	{
			        	"name": "NAME",
			        	"content": name
			       	},
			       	{
			       		"name": "VTOKEN",
			       		"content": vToken
			       	},
			       	{
			        	"name": "EMAIL",
			        	"content": emailAddress
			       	},
			       	{
			        	"name": "SCHOOL",
			        	"content": school
			       	}
			    ],
			    tags: ["beta-verify"],
			    track_opens: true,
			    track_clicks: true
			}
		};

		console.log(JSON.stringify(retVal));

		Meteor.http.post("https://mandrillapp.com/api/1.0/messages/send-template.json",//http://httpbin.org/post",
			{data: retVal},
			function(err, res) {
				console.log(res);
			}
		);
	}
});
