//the events past 4 hours will not be listed on the event page
referenceDateTime = moment().add('hours',-4).valueOf();

Template.invitationsPage.helpers({
  getInvites: function(){
    var userId = Meteor.userId();
    var invitedBubbles = Bubbles.find({
      'users.invitees': {$in: [userId]}
    }).fetch();

    return invitedBubbles;
  },

  numInvites: function(){
    var userId = Meteor.userId();
    var numInvitedBubbles = Bubbles.find({
      'users.invitees': {$in: [userId]}
    }).count();

    return numInvitedBubbles;
  },
});


Template.invitationsPage.rendered = function() {
  Meteor.subscribe('invitedBubbles');
}
