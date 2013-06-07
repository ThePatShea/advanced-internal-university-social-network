Template.sidebar.helpers({
  notificationCount: function(){
  	return Notifications.find({userId: Meteor.userId(), read: false, bubbleId: this._id}).count();
  },
  activeNotificationClass: function() {
  	var count = Notifications.find({userId: Meteor.userId(), read: false, bubbleId: this._id}).count();
    return (count > 0) && 'active';
  }
});
