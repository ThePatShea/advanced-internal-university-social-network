Template.bubbleApplicantsList.helpers({
	getApplicants: function() {
    return this.users.applicants;
  },
  chosen: function() {
    if(Session.get(Session.get('currentBubbleId')+Meteor.userId) == this.toString()){
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
    if (Session.get(Session.get('currentBubbleId')+Meteor.userId)){
      Session.set(Session.get('currentBubbleId')+Meteor.userId,undefined);
    }else{
      Session.set(Session.get('currentBubbleId')+Meteor.userId,this.toString());
    }
  }
});
