Template.sidebar.helpers({
  updateCount: function(){
  	return Updates.find({userId: Meteor.userId(), bubbleId: this._id}).count();
  },
  compressedCount: function(){
    var updateList = Updates.find({userId: Meteor.userId(), bubbleId:this._id}).fetch();
    compressedList = [];
    _.each(updateList, function(update){
      updateList = _.reject(updateList, function(newUpdate) {
        return update.postId == newUpdate.postId && update.updateType == 'newComment';
      });
      compressedList.push(update);
    });
    return compressedList.length;
  },
  getSidebarBubbles: function(){
    return Bubbles.find({$or: [{'users.members': Meteor.userId()}, {'users.admins': Meteor.userId()}]}, {limit: joinedBubblesHandle.limit()});
  },
  getInvitations: function() {
    invitees = [Meteor.userId()];
    var bubbles =  Bubbles.find({'users.invitees': Meteor.userId()});
    return bubbles;
  },
  hasInvitations: function() {
    invitees = [Meteor.userId()];
    var bubbles =  Bubbles.find({'users.invitees': Meteor.userId()});
    if(bubbles.count() >0){
      return true;
    }
    return false;
  }
});

Template.sidebar.events({
  'click .accept-invitation': function(){
    Bubbles.update({_id:this._id},
    {
      $addToSet: {'users.members': Meteor.userId()},
      $pull: {'users.invitees': Meteor.userId()}
    });
  },
  'click .reject-invitation': function(){
    if (confirm("Reject this invitation?")) {
      Bubbles.update({_id:this._id},
      {
        $pull: {'users.invitees': Meteor.userId()}
      });
    }
  }
}); 
