Template.bubbleItem.helpers({
	isAdmin: function(){
		var admins = this.users.admins;
		for (var i=0; i<admins.length; i++) {
			if (admins[i] == Meteor.userId()){
				return true;
			}
		}
	}
});

Template.bubbleItem.events({
  'click .addPost': function(){
    Session.set('currentBubbleId', this._id);
  }
});