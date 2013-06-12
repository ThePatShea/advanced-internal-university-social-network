Template.updatesList.helpers({
  updates: function() {

    var updateList = Updates.find({bubbleId: Session.get('currentBubbleId')}).fetch();
    var compressedList = [];
    _.each(updateList, function(update){
      updateList = _.reject(updateList, function(newUpdate) {
        return update.postId == newUpdate.postId && update.updateType == newUpdate.updateType == 'mewComment' ;
      });
      compressedList.push(update);
    });
    return compressedList;
  }
});
