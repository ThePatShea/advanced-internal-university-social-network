Template.flagItem.helpers({
	getPost: function() {
		return Posts.findOne(this.postId);
	}
});

Template.flagItem.events({
	'click .resolve-flag': function() {
		if (confirm("Solve this flag?")) {
			Meteor.call('resolveFlag',this._id);
		}
	}
});