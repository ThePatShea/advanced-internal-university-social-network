Template.bubbleItem.helpers({
	isAdmin: function(){
		var admins = this.users.admins;
		for (var i=0; i<admins.length; i++) {
			if (admins[i] == Meteor.userId()){
				return "Yes";
			}else{
			  	return "No";
			}
		}
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
