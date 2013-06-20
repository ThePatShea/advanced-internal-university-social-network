sendEmail = function(userId,title,body){
  var user = Meteor.users.findOne(userId);

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