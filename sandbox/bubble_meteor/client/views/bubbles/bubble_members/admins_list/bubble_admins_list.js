Template.bubbleAdminsList.helpers({
	getAdmins: function() {
    var adminIds = this.users.admins;
    return Meteor.users.find({_id: {$in: adminIds}}).fetch();
  }
});