Userlogs = new Meteor.Collection('userlogs');

Meteor.methods({
  createLog: function(page, form, action, hasLoggedIn){

    var log = {
      timestamp: new Date().getTime(),
      userId: Meteor.userId(),
      page: page,
      form: form,
      action: action,
      login: hasLoggedIn

    }
    log._id = Userlogs.insert(log);
    return log;
  }
});