Userlogs = new Meteor.Collection('userlogs');

Meteor.methods({
  createLog: function(page, hasLoggedIn){

    var log = {
      submitted: new Date().getTime(),
      userId: Meteor.userId(),
      page: page,
      login: hasLoggedIn
    }
    log._id = Userlogs.insert(log);
    return log;
  }
});