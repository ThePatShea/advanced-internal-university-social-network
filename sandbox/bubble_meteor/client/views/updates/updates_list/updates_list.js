Template.updatesList.helpers({
  updates: function() {
    var updateList = Updates.find({bubbleId: Session.get('currentBubbleId')}, {limit: 5}).fetch();

    //To combine updates with same userId, invokerId, updateType and postId
    _.each(updateList, function(update){
      updateList = _.reject(updateList, function(newUpdate) {
        return  update.bubbleId == newUpdate.bubbleId && 
                update.userId == newUpdate.userId && 
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
                update.updateType == 'REPLIED';
      });
      if(!_.contains(updateList,update)){
        updateList.push(update);
      }
    });

    // //To combine and chain up names for similar updates
    // applicantUpdates = _.reject(updateList, function(update) {
    //   return update.updateType != "NEW APPLICANT";
    // });
    // chainedName = _.pluck(applicantUpdates,"invokerName").join();
    // if(chainedName.legnth > 30) {
    //   chainedName = chainedName.substring(0,30);
    //   nameList = chainedName.split(',');
    //   nameList = chainedName.splice(chainedName.length-1,1);
    //   chainedName = nameList.join();
    // }

    // //First retrieve applicant
    // applicantUpdate = _.find(updateList, function(update) {
    //   update.invokerName = chainedName;
    //   return update.updateType == "NEW APPLICANT";
    // });
    // // Next remove all applicants
    // updateList = _.reject(updateList, function(newUpdate) {
    //   return newUpdate.updateType == 'NEW APPLICANT';
    // });
    // //Now all back with the applicant that has a changed invoker name
    // updateList.push(applicantUpdate);
    // updateList = _.sortBy(updateList, function(newUpdate) {
    //   return newUpdate.submitted;
    // }); 
    // console.log(updateList);

    return updateList;
  }
});
