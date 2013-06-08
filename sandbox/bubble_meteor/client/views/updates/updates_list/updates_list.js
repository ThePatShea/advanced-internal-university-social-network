Template.updatesList.helpers({
  updates: function() {
    return Updates.find({userId: Meteor.userId(), read: false});
  }
});
