Template.bubbleApplicantsList.helpers({
	getApplicants: function() {
    return this.users.applicants;
  },
  chosen: function() {
    if(Session.get(Session.get('currentBubbleId')+this.toString()) == this.toString()){
      return true;
    }
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
  },
  'click .activate': function() {
    if (Session.get(Session.get('currentBubbleId')+this.toString())){
      Session.set(Session.get('currentBubbleId')+this.toString(),undefined);
    }else{
      Session.set(Session.get('currentBubbleId')+this.toString(),this.toString());
    }
  }
});
