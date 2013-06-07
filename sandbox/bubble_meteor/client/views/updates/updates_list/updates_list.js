Template.updates.helpers({
  updates: function() {
    return Updates.find({userId: Meteor.userId(), read: false});
  },
  updateCount: function(){
  	return Updates.find({userId: Meteor.userId(), read: false}).count();
  },
  getInvokerName: function(userId){
  	return Meteor.users.find(userId).username;
  }
});

Template.update.events({
  'click a': function() {
    Updates.update(this._id, {$set: {read: true}});
  }
})