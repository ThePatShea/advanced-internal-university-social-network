if(!Meteor.users.findOne({username:'campusbubble'})){
	Accounts.createUser({
		username:'campusbubble',
		email:'development@thecampusbubble.com',
		password:'F302pinpulse'
	});
}