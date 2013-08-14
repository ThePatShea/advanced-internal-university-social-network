if(!Meteor.users.findOne({username:'campusbubble'})){
	Accounts.createUser({
		username:'campusbubble',
		email:'development@thecampusbubble.com',
		password:'F302pinpulse'
	});
/*
        Meteor.users.update({email: 'development@thecampusbubble.com'}, {$set: {profilePicture: '/img/letterprofiles/c.jpg'} });
*/
}
// if (Meteor.isServer) {
//   Meteor.startup(function () {
// 		Meteor.headly.config({tagsForRequest: function(req) {
// 		  return '<meta property="og:image" content="https://bubble.meteor.com/img/facebook.gif">' +
// 					    '<meta property="og:url" content="https://bubble.meteor.com">' +
// 					    '<meta property="og:title" content="Emory Bubble">';
// 		}});
// 	});
// 	// process.env.MONGO_URL = 'mongodb://haopjh:haopjh@dharma.mongohq.com:10032/bubbletest';
// 	// console.log(this.process.env);
// }
