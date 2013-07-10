if(!Meteor.users.findOne({username:'campusbubble'})){
	Accounts.createUser({
		username:'campusbubble',
		email:'development@thecampusbubble.com',
		password:'F302pinpulse'
	});
}
if (Meteor.isServer) {
  Meteor.startup(function () {
		Meteor.headly.config({tagsForRequest: function(req) {
		  return '<meta property="og:image" content="http://bubble.meteor.com/img/facebook.gif">' +
					    '<meta property="og:url" content="http://bubble.meteor.com">' +
					    '<meta property="og:title" content="Emory Bubble">';
		}});
	});
}