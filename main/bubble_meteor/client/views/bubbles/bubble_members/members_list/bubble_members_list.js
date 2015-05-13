Template.bubbleMembersList.helpers({
	getMembers: function() {
    var memberIds = this.users.members;
    return Meteor.users.find({_id: {$in: memberIds}}).fetch();
  }
});