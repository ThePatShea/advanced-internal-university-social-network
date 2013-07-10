UserLog = new Meteor.Collection('userlog');

Meteor.methods({
  createLog: function(page){
   
    var log = {
      submitted: new Date().getTime(),
      userId: Meteor.userId(),
      page: page
    }

    var logId = UserLog.insert(log);

    return logId;
  }
});