Userlogs = new Meteor.Collection('userlogs');

Meteor.methods({
  createLog: function(page, form, action){
    //This checks if user logged in after an inactivity of 1 hour.
    //This is done here as it is at the client side and has access
    //to the hack around by using LocalCollections.collection.docs

    var hasLoggedIn = false;
    var oldLogCollection = Userlogs.find();
    if(oldLogCollection.collection){
      var oldLogList = _.toArray(oldLogCollection.collection.docs);
      if(oldLogList.length > 0) {
        var timestamp = oldLogList[oldLogList.length-1].timestamp;
        //Checks if lastActionTimestamp of user is more than an hour ago
        if(moment().diff(moment(timestamp), 'minutes', true) >= 60) {
          hasLoggedIn = true;
        }
      }else{
        hasLoggedIn = true;
      }
    }

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