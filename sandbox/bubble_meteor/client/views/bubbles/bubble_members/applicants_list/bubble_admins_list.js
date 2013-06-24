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

    //Resets Session object to prevent complications
    Session.set(Session.get('currentBubbleId')+this.toString(),undefined);

    //Create update to inform user about accpeted application
    createNewMemberUpdate(this.toString());
  },
	'click .reject': function(){
    Bubbles.update({_id:Session.get('currentBubbleId')},
    {
      $pull: {'users.applicants': this.toString()}
    });

    //Resets Session object to prevent complications
    Session.set(Session.get('currentBubbleId')+this.toString(),undefined);

    //Create update to inform user about rejected application
    createRejectApplicationUpdate(this.toString());
  },
  'click .activate': function() {
    //Activates or deactivates options for specific user
    if (Session.get(Session.get('currentBubbleId')+this.toString())){
      Session.set(Session.get('currentBubbleId')+this.toString(),undefined);
    }else{
      Session.set(Session.get('currentBubbleId')+this.toString(),this.toString());
    }
  }
});
