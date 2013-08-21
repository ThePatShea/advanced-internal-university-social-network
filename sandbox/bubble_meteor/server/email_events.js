Meteor.methods({
	sendFlagEmail: function(flagId) {
		var flag = Meteor.flags.findOne({_id: flagId});
		var bubble = Meteor.bubbles.findOne({_id: flag.bubbleId});
		var moderatorList = Meteor.users.find({'userType': '3'}).fetch();
		var to = [];
		_.each(moderatorList, function(i) {
			tmp = Meteor.users.find({_id: i});
			to.push(tmp.emails[0].address);
		});
		var res = HTTP.post(SERVERHERE, {'invokerId': flag.invokerId, 'invokerName': flag.invokerName, 'bubbleId': flag.bubbleId, 'bubbleName': bubble.name, 'postId': flag.postId, 'to': to});
		console.log(res);
	},
	sendWelcomeEmail: function(userId) {
		var user = Meteor.users.findOne({_id: userId});
		var res = HTTP.post(SERVERHERE, {'userId': userId, 'name': user.name, 'to': user.emails[0].address});
		console.log(res);
	},
	sendInvitedEmail: function(userId, bubbleId) {
		var user = Meteor.users.findOne({_id: userId});
		var bubble = Meteor.bubbles.findOne({_id: bubbleId});
		var res = HTTP.post(SERVERHERE, {'userId': userId, 'bubbleId': bubbleId, 'name': user.name, 'bubbleName': bubble.title});
		console.log(res);
	},
	sendApplicantEmail: function(userId, bubbleId) {
		var user = Meteor.users.findOne({_id: userId});
		var bubble = Meteor.bubbles.findOne({_id: bubbleId});
		var adminIds = bubble.users.admins;
		var adminEmails = [];

		_.each(adminIds, function(i) {
			tmp = Meteor.users.find({_id: i})
			adminEmails.push(tmp.emails[0].address);
		});

		var res = HTTP.post(SERVERHERE, {'userId': userId, 'name': user.name, 'bubbleId': bubbleId, 'bubbleName': bubble.title, 'to': adminEmails})
		console.log(res);
	}
});