Template.userProfile.helpers({
	getUser: function() {
		return Meteor.users.findOne({_id:Session.get('selectedUserId')});
	},

	getBubblesList: function(){
		return Bubbles.find({'users.admins':this._id});
	},

	getEmail: function(){
		return this.emails[0].address;
	}

});