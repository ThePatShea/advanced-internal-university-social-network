if(Meteor.isServer){
  Meteor.methods({
    sendEmail: function (to, subject, text) {
      check([to, subject, text], [String]);

      // Let other method calls from the same client start running,
      // without waiting for the email sending to complete.
      this.unblock();

      Email.send({
        to: to,
        from: "no-reply@emorybubble.com",
        subject: subject,
        html: text
      });
      console.log("An email is sent");
    }
  });
  
  Meteor.startup(function () {
    // process.env.MAIL_URL = 'smtp://no-reply%40thecampusbubble.com:u3nT8dAC@smtp.gmail.com:465/';
  });
}

sendEmail = function(userId,title,body){
  var user = Meteor.users.findOne(userId);

  if (user) {
    console.log("Email is currently disabled to prevent flooding of developer's mailbox");
    // Meteor.call( 'sendEmail',
    //   user.emails[0].address,
    //   title,
    //   body
    // );
  }else{
    console.log("User is undefined for sending emails");
  }
}