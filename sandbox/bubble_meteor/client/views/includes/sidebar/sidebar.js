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
    return Bubbles.find({}, {sort: {submitted: -1}, limit: 5});
  },

  getInvitations: function() {
    var bubbles =  Bubbles.find({'users.invitees':Meteor.userId()});
    console.log(bubbles.fetch());
    return bubbles;
  }
});
