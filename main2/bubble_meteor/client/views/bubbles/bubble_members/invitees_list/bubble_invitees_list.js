Template.bubbleInviteesList.helpers({
  getInvitees: function() {
    var inviteeIds = this.users.invitees;
    return Meteor.users.find({_id: {$in: inviteeIds}}).fetch();
  }
});