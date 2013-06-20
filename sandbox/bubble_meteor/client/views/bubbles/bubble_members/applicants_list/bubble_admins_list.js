Template.bubbleApplicantsList.helpers({
	getApplicants: function() {
    return this.users.applicants;
  }
});

Template.bubbleApplicantsList.events({
  'click .accept': function(){
    Bubbles.update({_id:Session.get('currentBubbleId')},
    {
      $addToSet: {'users.members': this.toString()},
      $pull: {'users.applicants': this.toString()}
    });
  },
	'click .reject': function(){
    Bubbles.update({_id:Session.get('currentBubbleId')},
    {
      $pull: {'users.applicants': this.toString()}
    });
  }
});
