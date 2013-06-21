Template.updatesDropdown.helpers({
  updates: function() {
    return Updates.find({userId: Meteor.userId()});
  },
  updateCount: function(){
  	return Updates.find({userId: Meteor.userId(), read: false}).count();
  },
  compressUpdates: function(){
    var updateList = Updates.find().fetch();
    _.each(updateList, function(update){
      updateList = _.reject(updateList, function(newUpdate) {
        return update.userId == newUpdate.userId && 
                update.invokerId == newUpdate.invokerId && 
                update.updateType == newUpdate.updateType;
      });
      updateList.push(update);
    });
    return updateList;
  },
  compressedCount: function(){
    var updateList = Updates.find().fetch();
    _.each(updateList, function(update){
      updateList = _.reject(updateList, function(newUpdate) {
        return update.userId == newUpdate.userId && 
                update.invokerId == newUpdate.invokerId && 
                update.updateType == newUpdate.updateType;
      });
      updateList.push(update);
    });
    return updateList.length;
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