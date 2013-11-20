Template.updatesDropdown.created = function(){
  //numberOfUpdates = 0;
  updateIds = [];
  mainUpdatesHandle = Meteor.subscribeWithPagination('updates', Meteor.userId(), 1);
  bubblepop = new Audio('/sounds/bubblepop.wav');
}

Template.updatesDropdown.rendered = function() {

}


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
    var updateList = Updates.find({userId: Meteor.userId(), read:false}).fetch();


    //To combine updates with same userId, invokerId, updateType and postId
    if(updateList.length > 0) {
      //If there are new updates then play the bubble pop sound
      var playPop = false;
      _.each(updateList, function(update){
        var updateId = update._id;
        if(updateIds.indexOf(updateId) == -1){
          playPop = true;
          updateIds.push(updateId);
        }
      });

      if(playPop == true){
        bubblepop.play();
      }


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
      _.each(updateList, function(update){

        var commentUpdates = _.reject(updateList, function(update) {
          return update.updateType != "replied";
        });

        //Combine and chain the names together
        if (commentUpdates.length > 0) {
          updateList = _.reject(updateList, function(newUpdate) {
            return update.postId == newUpdate.postId &&
                    update.updateType == newUpdate.updateType &&
                    update.updateType == "replied";
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

      //Declaring the types that needs collapsing of names
      var bubbleUpdateList =
      [
        "new applicant",
        "new attendee",
        "member promoted",
        "member demoted",
        "joined bubble"
      ]

      /**
      *  To combine and chain up names for compressed updates
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
      return _.toArray(_.groupBy(updateList.slice(0,6),'bubbleId'));
    }
  },
  compressedCount: function(){
    var updateList = Updates.find({userId: Meteor.userId(), read:false}).fetch();

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
      _.each(updateList, function(update){

        var commentUpdates = _.reject(updateList, function(update) {
          return update.updateType != "replied";
        });

        //Combine and chain the names together
        if (commentUpdates.length > 0) {
          updateList = _.reject(updateList, function(newUpdate) {
            return update.postId == newUpdate.postId &&
                    update.updateType == newUpdate.updateType &&
                    update.updateType == "replied";
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

      //Declaring the types that needs collapsing of names
      var bubbleUpdateList =
      [
        "new applicant",
        "new attendee",
        "member promoted",
        "member demoted",
        "joined bubble"
      ]

      /**
      *  To combine and chain up names for compressed updates
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
  /*
  'click .set-loading' : function() {
    console.log("SET LOADING");
    Session.set("isLoading", true);
  }
  */
});

Template.updatesDropdown.events({
  'click #seeall': function() {
    setTimeout(function(){Session.set('updatesToShow',0);},1000);
    Meteor.Router.to('dashboard');
  },
  'click #clearall': function() {
    var updates = Updates.find({userId: Meteor.userId(), read:false}).fetch();
    _.each(updates, function(update) {
      Meteor.call('setRead', update);
    });
  }
})

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
    Meteor.subscribe('findUsersByUsername',this.invokerName);
    //Meteor.subscribe('findUserByName', this.invokerName);
    //Meteor.subscribe('findNameFromUsername', this.invokerName);
    console.log("CONTENT: ", this.content);
    console.log("INVOKERNAME: ", this.invokerName);
    if(this.updateType == "replied" ||
        this.updateType == "new attendee" ||
        this.updateType == "new applicant"){
      var content = this.content;
      var nameList = this.invokerName.split('and');
      if(nameList.length > 1){
        content = content.replace('is', 'are');
      };

      this.user = Meteor.users.findOne({'username': this.invokerName},{fields: {'name': 1}});
      console.log("USER: ", this.user);
      if(typeof this.user !== "undefined")
        return this.user.name + content;
      return this.invokerName + content;
    }else{
      return this.content;
    }

  }
});

Template.updateBubble.helpers({
  getBubble: function(obj) {
    if(obj && obj.length > 0){
      return Bubbles.findOne(obj[0].bubbleId);
    }
  }
});
