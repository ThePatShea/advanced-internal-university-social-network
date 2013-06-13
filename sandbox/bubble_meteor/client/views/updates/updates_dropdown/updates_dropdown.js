Template.updatesDropdown.helpers({
  updates: function() {
    return Updates.find({userId: Meteor.userId()});
  },
  updateCount: function(){
  	return Updates.find({userId: Meteor.userId(), read: false}).count();
  },
  compressUpdates: function(){
    var updateList = Updates.find().fetch();
    compressedList = [];

    _.each(updateList, function(update){
      updateList = _.reject(updateList, function(newUpdate) {
        return update.postId == newUpdate.postId && update.updateType == 'newComment';
      });
      compressedList.push(update);
    });
    return compressedList;
  },
  compressedCount: function(){
    var updateList = Updates.find().fetch();
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