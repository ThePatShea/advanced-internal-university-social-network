Template.updatesList.helpers({
  updates: function() {
    var updateList = Updates.find({userId: Meteor.userId(), read: false, bubbleId:Session.get('currentBubbleId')});
    
    updateList = updateList.collection.docs;
    _.each(updateList, function(update){
      updateList = _.reject(updateList, function(newUpdate) {
        return update.postId == newUpdate.postId;
      });
      updateList.push(update);
    });
    console.log(updateList);
    return updateList;
  }
});
