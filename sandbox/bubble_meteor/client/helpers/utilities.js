sendEmail = function(userId,title,body){
  Session.set('selectedUser', userId); 
  var user = Meteor.users.findOne(Session.get('selectedUser'));

  if (user) {
	  Meteor.call( 'sendEmail',
	    user.emails[0].address,
	    title,
	    body
	  );
  }else{
    console.log("User is undefined for sending emails");
  }
}