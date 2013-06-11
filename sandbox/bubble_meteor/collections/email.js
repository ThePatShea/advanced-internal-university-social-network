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
        text: text
      });
    }
  });
}
