Template.updatesList.helpers({
  updates: function() {
    var updateList = Updates.find({bubbleId: Session.get('currentBubbleId')}).fetch();

    //To combine updates with same userId, invokerId, updateType and postId
    _.each(updateList, function(update){
      updateList = _.reject(updateList, function(newUpdate) {
        return update.userId == newUpdate.userId && 
                update.invokerId == newUpdate.invokerId && 
                update.updateType == newUpdate.updateType &&
                update.postId == newUpdate.postId;
      });
      if(!_.contains(updateList,update)){
        updateList.push(update);
      }
    });

    //To combine updates for comments in the same post
    _.each(updateList, function(update){
      updateList = _.reject(updateList, function(newUpdate) {
        return update.postId == newUpdate.postId && 
                update.updateType == newUpdate.updateType &&
                update.updateType == 'newComment';
      });
      if(!_.contains(updateList,update)){
        updateList.push(update);
      }
    });

    return updateList;
  }
});
