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
  }
});
