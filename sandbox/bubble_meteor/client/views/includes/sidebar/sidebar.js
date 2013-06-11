Template.sidebar.helpers({
  updateCount: function(){
  	return Updates.find({userId: Meteor.userId(), read: false, bubbleId: this._id}).count();
  },
  compressedCount: function(){
    var compressedPostList = [];
    var updateList = Updates.find({userId: Meteor.userId(), read: false, bubbleId: this._id});
    for (var i=0; i<updateList.count(); i++) {
      var update = updateList.db_objects[i];
      var added = false;
      update.counter = 1;
      for (var j=0; j<compressedPostList.length; j++){
        var compressed = compressedPostList[j];
        if (compressed.updateType == update.updateType
            && compressed.updateType == 'newComment'
            && compressed.postId == update.postId) {
          update.compressedPostList += compressed.counter;
          compressedPostList[j] = update;
          added = true;
          break;
        }
      }
      if (!added){
        compressedPostList.push(update);
      }
    }
    return compressedPostList.length;
  }

});
