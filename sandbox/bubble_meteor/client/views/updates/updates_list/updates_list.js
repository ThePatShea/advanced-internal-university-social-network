Template.updatesList.helpers({
  updates: function() {
  	var compressedList = [];
    var updateList = Updates.find({userId: Meteor.userId(), read: false, bubbleId:Session.get('currentBubbleId')});
    
    // console.log(updateList.collection.docs);
    // console.log(_.where(updateList.collection.docs,{updateType:"newPost"}));
    updateList = _.sortBy(updateList.collection.docs, function(update) {
      return update.sumitted;
    });

    _.each(updateList, function(update){
      updateList = _.reject(updateList, function(newUpdate) {
        return update.postId == newUpdate.postId;
      });
      updateList.push(update);
    });

    // for (var i=0; i<updateList.count(); i++) {
    //   var update = updateList.db_objects[i];
    //   var added = false;
    //   update.counter = 1;
    //   for (var j=0; j<compressedList.length; j++){
    //     var compressed = compressedList[j];
    //     if (compressed.updateType == update.updateType
    //         && compressed.updateType == 'newComment'
    //         && compressed.postId == update.postId) {
    //       update.counter += compressed.counter;
    //       compressedList[j] = update;
    //       added = true;
    //       break;
    //     }
    //   }
    //   if (!added){
    //     compressedList.push(update);
    //   }
    // }
    return updateList;
   
  }
});
