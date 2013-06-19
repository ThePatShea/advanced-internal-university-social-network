Template.bubbleItem.helpers({
	isAdmin: function(){
		return _.contains(this.users.admins,Meteor.userId());
	},
	getCategory: function(){
		var category = this.category;
		if(category == 'academics') {
			return 'Academics';
		}else if(category == 'studentresource'){
			return 'Student Resource';
		}else if(category == 'studentorganization'){
			return 'Student Organization';
		}
	}
});

Template.bubbleItem.events({
  'click .addPost': function(){
    Session.set('currentBubbleId', this._id);
  }
});

