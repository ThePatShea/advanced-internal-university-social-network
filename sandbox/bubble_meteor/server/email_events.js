Meteor.methods({
	sendFlagEmail: function(flag) {
		var bubble = Bubbles.findOne({_id: flag.bubbleId});
		var moderatorList = Meteor.users.find({'userType': '3'}).fetch();
		var to = [];
		_.each(moderatorList, function(i) {
			to.push(i.emails[0].address);
		});
		//var res = HTTP.post("http://httpbin.org/post", {'invokerId': flag.invokerId, 'invokerName': flag.invokerName, 'bubbleId': flag.bubbleId, 'bubbleName': bubble.name, 'postId': flag.postId, 'to': to});
		var retVal = {'invokerId': flag.invokerId, 'invokerName': flag.invokerName, 'bubbleId': flag.bubbleId, 'bubbleName': bubble.name, 'postId': flag.postId, 'to': to.toString()};
		Meteor.http.post("HOSTNAME/sendFlagEmail",//http://httpbin.org/post",
			{"data": retVal},
			function(err, res) {
				console.log(res);
			}
		);
	},
	sendWelcomeEmail: function(userId) {
		var user = Meteor.users.findOne({_id: userId});
		//var res = HTTP.post("http://httpbin.org/post", {'userId': userId, 'name': user.name, 'to': user.emails[0].address});
		var retVal = {'userId': userId, 'name': user.name, 'to': user.emails[0].address};
		Meteor.http.post("HOSTNAME/sendWelcomeEmail",//http://httpbin.org/post",
			{"data": retVal},
			function(err, res) {
				console.log(res);
			}
		);
	},
	sendInvitedEmail: function(currentUserId, userId, bubbleId) {
		var currentUser = Meteor.users.findOne({_id: currentUserId});
		var user = Meteor.users.findOne({_id: userId});
		var bubble = Bubbles.findOne({_id: bubbleId});
		var retVal = {'currentUserId': currentUserId, 'currentUserName': currentUser.name, 'userId': userId, 'bubbleId': bubbleId, 'name': user.name, 'bubbleName': bubble.title, 'to': user.emails[0].address};
		Meteor.http.post("HOSTNAME/sendInvitedEmail",//http://httpbin.org/post",
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
		var adminEmails = [];

		_.each(adminIds, function(i) {
			tmp = Meteor.users.findOne({_id: i});
			adminEmails.push(tmp.emails[0].address);
		});
		var retVal = {'userId': userId, 'name': user.name, 'bubbleId': bubbleId, 'bubbleName': bubble.title, 'to': adminEmails.toString()};

		//var res = HTTP.post("http://httpbin.org/post", {'userId': userId, 'name': user.name, 'bubbleId': bubbleId, 'bubbleName': bubble.title, 'to': adminEmails})
		Meteor.http.post("HOSTNAME/sendApplicantEmail",//http://httpbin.org/post",
			{"data": retVal},
			function(err, res) {
				console.log(res);
			}
		);
	}
});