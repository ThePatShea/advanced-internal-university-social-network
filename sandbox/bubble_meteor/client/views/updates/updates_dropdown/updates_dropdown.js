Template.updatesDropdown.helpers({
  updates: function() {
    return Updates.find({userId: Meteor.userId()});
  },
  updateCount: function(){
  	return Updates.find({userId: Meteor.userId(), read: false}).count();
  },
  getBubble: function(bubbleId) { 
    return Bubbles.findOne(bubbleId);
  },
  compressUpdates: function(){
    var bubbleList = Bubbles.find({$or: [{'users.members': Meteor.userId()},{'users.admins':  Meteor.userId()}]}).fetch();
    var resultList = [];

    _.each(bubbleList, function(bubble) {
      var updateList = Updates.find({userId: Meteor.userId(), bubbleId:bubble._id, read:false}).fetch();

      //To combine updates with same userId, invokerId, updateType and postId
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

        resultList.push(updateList);
      }
    });
    return resultList;
  },
  compressedCount: function(){
    var bubbleList = Bubbles.find({$or: [{'users.members': Meteor.userId()},{'users.admins':  Meteor.userId()}]}).fetch();
    var resultList = [];

    _.each(bubbleList, function(bubble) {
      var updateList = Updates.find({userId: Meteor.userId(), bubbleId:bubble._id}).fetch();

      //To combine updates with same userId, invokerId, updateType and postId
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
        
        resultList =  resultList.concat(updateList);
      }
    });
    return resultList.length;
  }
});

Template.update.events({
  'click a': function() {
    Meteor.call('setRead', this);
  }
})


Template.update.helpers({
  updateTypeIs: function(updateType){
    return updateType == this.updateType;
  },
  getContent: function() {
    if(this.updateType == "REPLIED" ||
        this.updateType == "NEW ATTENDEE" ||
        this.updateType == "JOINED BUBBLE" ||
        this.updateType == "NEW APPLICANT"){
      var content = this.content;
      var nameList = this.invokerName.split('and');
      if(nameList.length > 1){
        content = content.replace('is', 'are');
      }
      return this.invokerName + content;
    }else{
      return this.content;
    }
  }
});

Template.updateBubble.helpers({
  getBubbleId: function() {
    return this[0].bubbleId;
  },  
  getBubbleName: function() {
    return Bubbles.findOne(this[0].bubbleId).title;
  },
});