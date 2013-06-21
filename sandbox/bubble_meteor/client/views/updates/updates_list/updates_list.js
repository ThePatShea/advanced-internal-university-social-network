Template.updatesList.helpers({
  updates: function() {
    var updateList = Updates.find({bubbleId: Session.get('currentBubbleId')}).fetch();
    _.each(updateList, function(update){

      updateList = _.reject(updateList, function(newUpdate) {
        return update.userId == newUpdate.userId && 
                update.invokerId == newUpdate.invokerId && 
                update.updateType == newUpdate.updateType;
      });
      updateList.push(update);
    });
    return updateList;
  }
});
