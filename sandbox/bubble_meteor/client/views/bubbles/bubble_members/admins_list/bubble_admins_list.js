Template.bubbleAdminsList.helpers({
	getAdmins: function() {
    return this.users.admins;
  },
  ifNotSelf: function() {
  	return this.toString() != Meteor.userId();
  },
  chosen: function() {
    if(Session.get(Session.get('currentBubbleId')+this.toString()) == this.toString()){
      return true;
    }
  }

});

Template.bubbleAdminsList.events({
	'click .demote-admin': function(){
    Bubbles.update({_id:Session.get('currentBubbleId')},
    {
      $addToSet: {'users.members': this.toString()},
      $pull: {'users.admins': this.toString()}
    });
    Session.set(Session.get('currentBubbleId')+this.toString(),undefined);
  },
  'click .activate': function() {
    if (Session.get(Session.get('currentBubbleId')+this.toString())){
      Session.set(Session.get('currentBubbleId')+this.toString(),undefined);
    }else{
      Session.set(Session.get('currentBubbleId')+this.toString(),this.toString());
    }
  }
});
