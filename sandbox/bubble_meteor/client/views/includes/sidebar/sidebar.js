Template.sidebar.helpers({
  updateCount: function(){
  	return Updates.find({userId: Meteor.userId(), read: false, bubbleId: this._id}).count();
  }
});
