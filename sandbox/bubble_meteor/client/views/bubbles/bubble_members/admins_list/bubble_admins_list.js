Template.bubbleAdminsList.helpers({
	getAdmins: function() {
    return this.users.admins;
  }
});

Template.bubbleAdminsList.events({
	'click .demote-admin': function(){
    var bubble = Bubbles.findOne(Session.get('currentBubbleId'));
    var admins = bubble.users.admins;

    if(admins.length > 1){
      Bubbles.update({_id:Session.get('currentBubbleId')},
      {
        $addToSet: {'users.members': this.toString()},
        $pull: {'users.admins': this.toString()}
      });
      Session.set(Session.get('currentBubbleId')+this.toString(),undefined);
      createAdminDemoteUpdate(this.toString());
    }else{
      alert("There are no more admins left. Please promote another member before demoting yourself!");
    }
    
  },
  'click .activate': function() {
    if (Session.get(Session.get('currentBubbleId')+this.toString())){
      Session.set(Session.get('currentBubbleId')+this.toString(),undefined);
    }else{
      Session.set(Session.get('currentBubbleId')+this.toString(),this.toString());
    }
  },
  //This happens when admin leaves the bubble
  'click .remove-admin': function() {
    var bubble = Bubbles.findOne(Session.get('currentBubbleId'));
    var admins = bubble.users.admins;
    var members = bubble.users.members;
    var count = admins.length + members.length
    if(count > 1){
      Bubbles.update({_id:Session.get('currentBubbleId')},
      {
        $pull: {'users.admins': this.toString()}
      });

      admins.splice(admins.length-1,1);
       //If no more admins are left, the earliest member will be an admin
      if(admins.length == 0){
        Bubbles.update({_id:Session.get('currentBubbleId')},
        {
          $addToSet: {'users.admins': members[0]},
          $pull: {'users.members': members[0]}
        });
        Session.set(Session.get('currentBubbleId')+this.toString(),undefined);
      }

      Session.set(Session.get('currentBubbleId')+this.toString(),undefined);
    }else{
      alert("There are no more members left. Bubble will be deleted");
      var updates = Updates.find({bubbleId: Session.get('currentBubbleId')}, {read:false}).fetch();
      _.each(updates, function(update){
        Updates.update({_id: update._id}, {read:true});
      });
      Bubbles.remove({_id:Session.get('currentBubbleId')});

      //Route to the next available bubble or to the search page
      var bubble = Bubbles.find({$or: [{'users.members': Meteor.userId()},{'users.admins': Meteor.userId()}]}, {sort: {submitted: -1}}).fetch();
      if(bubble.length > 0){
        Meteor.Router.to('/bubbles/'+bubble[0]._id+'/home');
      }else{
        Meteor.Router.to('/search/bubbles');
      }
    }


    
  }
});
