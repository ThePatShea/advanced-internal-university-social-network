Template.sidebar.helpers({
  updateCount: function(){
  	return Updates.find({userId: Meteor.userId(), bubbleId: this._id}).count();
  },
  compressedCount: function(){
    var updateList = Updates.find({userId: Meteor.userId(), bubbleId:this._id}).fetch();
    if(updateList.length > 0) {
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

      /**
      * To combine updates for comments in the same post
      **/
      var postUpdateList = 
      [ 
        "REPLIED",
        "EVENT CANCELLED"
      ]
      _.each(postUpdateList, function(type) {
        _.each(updateList, function(update){

          var commentUpdates = _.reject(updateList, function(update) {
            return update.updateType != type;
          });

          //Combine and chain the names together
          if (commentUpdates.length > 0) {
            updateList = _.reject(updateList, function(newUpdate) {
              return update.postId == newUpdate.postId && 
                      update.updateType == newUpdate.updateType &&
                      update.updateType == type;
            });
            if(!_.contains(updateList,update)) {
              //Pull out comment updates that belong to the same post
              singleTypeUpdates = _.reject(commentUpdates, function(newUpdate) {
                return update.postId != newUpdate.postId;
              });
              if (singleTypeUpdates.length > 0) {
                //Create the chained name
                var nameArray = _.pluck(singleTypeUpdates,"invokerName");
                var chainedName = nameArray.join();
                var maxLength = 13;

                //Checks to see if the length of names exceed a certain limit
                if(chainedName.length > maxLength) {
                  chainedName = chainedName.substring(0,maxLength);
                  var nameList = chainedName.split(',');
                  if(nameArray[0].length > maxLength) {
                    nameList[0] = nameArray[0];
                  }else{
                    nameList.pop();
                  }
                  var excessCount = nameArray.length - nameList.length;
                  chainedName = nameList.join();
                  if(excessCount == 1) {
                    chainedName = chainedName + " and " + excessCount + " other";
                  }else if(excessCount > 1){
                    chainedName = chainedName + " and " + excessCount + " others";
                  }
                }else{
                  chainedName = chainedName.replace(/,([^,]*)$/," and $1");
                }

                //Add the chained name to the invokerName
                update.invokerName = chainedName;
              }
              updateList.push(update);
            }
          }
        });
      });

      //Declaring the types that needs collapsing of names
      var bubbleUpdateList = 
      [ 
        "NEW APPLICANT",
        "NEW ATTENDEE",        
        "MEMBER PROMOTED",
        "MEMBER DEMOTED",
        "JOINED BUBBLE"
      ]

      /**
      *  To combine and chain up names for similar updates
      **/
      _.each(bubbleUpdateList, function(type) {
        var singleTypeUpdates = _.reject(updateList, function(update) {
          return update.updateType != type;
        });
        if (singleTypeUpdates.length > 0) {
          var nameArray = _.pluck(singleTypeUpdates,"invokerName");
          var chainedName = nameArray.join();
          var maxLength = 13;

          if(chainedName.length > maxLength) {
            chainedName = chainedName.substring(0,maxLength);
            var nameList = chainedName.split(',');
            if(nameArray[0].length > maxLength) {
              nameList[0] = nameArray[0];
            }else{
              nameList.pop();
            }
            var excessCount = nameArray.length - nameList.length;
            chainedName = nameList.join();
            if(excessCount == 1) {
              chainedName = chainedName + " and " + excessCount + " other";
            }else{
              chainedName = chainedName + " and " + excessCount + " others";
            } 
          }else{
            chainedName = chainedName.replace(/,([^,]*)$/," and $1");
          }

          //First retrieve applicant
          var firstUpdate = _.find(updateList, function(update) {
            update.invokerName = chainedName;
            return update.updateType == type
          });
          // Next remove all applicants
          updateList = _.reject(updateList, function(newUpdate) {
            return newUpdate.updateType == type;
          });
          //Now ad back with the applicant that has a changed invoker name
          if(firstUpdate){
            updateList.push(firstUpdate);
          }
        }
        
      });

      updateList = _.sortBy(updateList, function(newUpdate) {
        return newUpdate.submitted; 
      }); 
      
      return updateList.length;
    }
  },
  getSidebarBubbles: function(){
    return Bubbles.find({$or: [{'users.members': Meteor.userId()}, {'users.admins': Meteor.userId()}]},{sort: {'users.members': -1, 'users.admins': -1}});
  },
  getInvitations: function() {
    invitees = [Meteor.userId()];
    var bubbles =  Bubbles.find({'users.invitees': Meteor.userId()});
    return bubbles;
  },
  hasInvitations: function() {
    invitees = [Meteor.userId()];
    var bubbles =  Bubbles.find({'users.invitees': Meteor.userId()});
    if(bubbles.count() >0){
      return true;
    }
    return false;
  }
});

Template.sidebar.events({
  'click .accept-invitation': function(){
    Bubbles.update({_id:this._id},
    {
      $addToSet: {'users.members': Meteor.userId()},
      $pull: {'users.invitees': Meteor.userId()}
    });
    createNewMemberUpdate(Meteor.userId(),this._id);

    Meteor.call('setRead', Updates.findOne({userId:Meteor.userId(), bubbleId:this._id, updateType:"INVITATION"}));
  },
  'click .reject-invitation': function(){
    if (confirm("Reject this invitation?")) {
      Bubbles.update({_id:this._id},
      {
        $pull: {'users.invitees': Meteor.userId()}
      });
    }
  }
}); 

Template.sidebar.rendered = function() {
  // Ensure that the sidebar has a scroll bar whenever it has more buttons than can fit on it
    var resizeMainBtns = function() {
      $('.main-btns').height($(window).height() - $('.navbar').height() - $('.top-btns').height());
    }
  
    window.onresize = function() {
      resizeMainBtns();
    }
  
    resizeMainBtns();
}
