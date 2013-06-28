Template.bubbleItem.helpers({
	isAdmin: function(){
		return _.contains(this.users.admins,Meteor.userId());
	}
});

Template.bubbleItem.events({
  'click .addPost': function(){
    Session.set('currentBubbleId', this._id);
  }
});

