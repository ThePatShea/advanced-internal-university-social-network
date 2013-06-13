Template.updatesDropdown.helpers({
  updates: function() {
    return Updates.find({userId: Meteor.userId(), read: false});
  },
  updateCount: function(){
  	return Updates.find({userId: Meteor.userId(), read: false}).count();
  },
  compressUpdates: function(){
    var compressedList = [];
    var updateList = Updates.find({userId: Meteor.userId(), read: false});
    for (var i=0; i<updateList.count(); i++) {
      var update = updateList.db_objects[i];
      var added = false;
      update.counter = 1;
      for (var j=0; j<compressedList.length; j++){
        var compressed = compressedList[j];
        if (compressed.updateType == update.updateType
            && compressed.updateType == 'newComment'
            && compressed.postId == update.postId) {
          update.counter += compressed.counter;
          compressedList[j] = update;
          added = true;
          break;
        }
      }
      if (!added){
        compressedList.push(update);
      }
    }
    return compressedList;
  },
  compressedCount: function(){
    var compressedList = [];
    var updateList = Updates.find({userId: Meteor.userId(), read: false});
    for (var i=0; i<updateList.count(); i++) {
      var update = updateList.db_objects[i];
      var added = false;
      update.counter = 1;
      for (var j=0; j<compressedList.length; j++){
        var compressed = compressedList[j];
        if (compressed.updateType == update.updateType
            && compressed.updateType == 'newComment'
            && compressed.postId == update.postId) {
          update.counter += compressed.counter;
          compressedList[j] = update;
          added = true;
          break;
        }
      }
      if (!added){
        compressedList.push(update);
      }
    }
    return compressedList.length;
  }
});

Template.update.events({
  'click a': function() {
    Updates.update(this._id, {$set: {read: true}});
  }
})


Template.update.helpers({
  updateTypeIs: function(updateType){
    return updateType == this.updateType;
  }
});