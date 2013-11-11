//the events past 4 hours will not be listed on the event page
referenceDateTime = moment().add('hours',-4).valueOf();

Template.bubblePageBackbone.destroyed = function() {
  console.log("BUBBLE HOME PAGE DESTROYED!");
  delete bubbleHomeDep;
}

Template.bubblePageBackbone.created = function() {
  console.log("Home Page Created!");
  Session.set('updatesToShow',3);
  Meteor.subscribe('updatedPosts', Meteor.userId());

  bubbleHomeDep = new Deps.Dependency;
  if(typeof goingDep === "undefined")
    goingDep = new Deps.Dependency;

  Session.set("isLoading", true);

  currentBubbleId = window.location.pathname.split("/")[2];

  bubbleHomeHelper();
}


Template.bubblePageBackbone.rendered = function() {
  console.log('Rendered bubble page');

  if(currentBubbleId != window.location.pathname.split("/")[2])
  {
    console.log('Bubble changed');
    currentBubbleId = window.location.pathname.split("/")[2];

    var isMemberAjax = $.ajax({url: '/2013-09-11/ismember?bubbleid=' + currentBubbleId + '&userid=' + Meteor.userId()});
    var isAdminAjax = $.ajax({url: '/2013-09-11/isadmin?bubbleid=' + currentBubbleId + '&userid=' + Meteor.userId()});
    if(isMemberAjax.responseText == 'False' && isAdminAjax.responseText == 'False'){
      Meteor.Router.to('bubblePublicPage', bubble._id);
    }

    bubbleHomeHelper();
  };

  $(document).attr('title', 'My Bubbles - Emory Bubble');
};

Template.bubblePageBackbone.helpers({
  testNumUpdates: function() {
    if(Session.get(currentBubbleId+'testNumUpdates') > 0)
      return Session.get(currentBubbleId+'testNumUpdates');
    else
      return 0;
  },

  testGetUpdates: function() {
    var updateList = Updates.find({userId: Meteor.userId(), bubbleId: window.location.pathname.split("/")[2], read:false}).fetch();

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

        /**
        *  To combine and chain up names for similar updates
        **/
        _.each(updateList, function(originalUpdate) {
          if(originalUpdate.collapsible == true){
            var type = originalUpdate.updateType;
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

              originalUpdate.invokerName = chainedName;
              // Next remove all applicants
              updateList = _.reject(updateList, function(newUpdate) {
                return newUpdate.updateType == type;
              });
              //Now add back with the applicant that has a changed invoker name
              if(firstUpdate){
                updateList.push(firstUpdate);
              }
            }
          }
        });

        updateList = _.sortBy(updateList, function(newUpdate) {
          return newUpdate.submitted; 
        });  
        
      Session.set(currentBubbleId+"testNumUpdates",updateList.length);

        if(Session.get('updatesToShow')>0){
          return _.first(updateList.reverse(), Session.get('updatesToShow'));
        }else{
          return updateList.reverse();
        }
    }
  },
  getCurrentBubbleBackbone: function(){
    bubbleHomeDep.depend();
    var bubble = mybubbles.bubbleInfo.toJSON();
    return bubble;
  },
  eventsCount: function() {
    var events = mybubbles.Events.getJSON();
    return events.count - 3;
  },
  discussionsCount: function() {
    var discussions = mybubbles.Discussions.getJSON();
    return discussions.count - 3;
  },
  filesCount: function() {
    var files = mybubbles.Files.getJSON();
    return files.count - 3;
  },

  // check if there are more posts to view
  hasMoreEvents: function() {
    //var num = Posts.find({bubbleId:Session.get('currentBubbleId'), postType:'event', dateTime: {$gt: referenceDateTime}}).count() - 3;
    var events = mybubbles.Events.getJSON();
    var num = events.count - 3;
    if (num > 0){
      return true;
    }else{
      return false;
    }
  },

  numMoreEvents: function(){
    //var num = Posts.find({bubbleId:Session.get('currentBubbleId'), postType:'event', dateTime: {$gt: referenceDateTime}}).count() - 3;
    var events = mybubbles.Events.getJSON();
    var num = events.count - 3;
    return num;
  },
  hasMoreDiscussions: function() {
    //var num = Posts.find({bubbleId:Session.get('currentBubbleId'), postType:'discussion'}).count() - 3;
    var discussions = mybubbles.Discussions.getJSON();
    var num = discussions.count - 3;
    if (num > 0){
      return true;
    }else{
      return false;
    }
  },
  numMoreDiscussionsCount: function(){
    //var num = Posts.find({bubbleId:Session.get('currentBubbleId'), postType:'discussion'}).count() - 3;
    var discussions = mybubbles.Discussions.getJSON();
    var num = discussions.count - 3;
    return num;
  },
  hasMoreFiles: function() {
    //var num = Posts.find({bubbleId:Session.get('currentBubbleId'), postType:'file'}).count() - 3;
    var files = mybubbles.Files.getJSON();
    var num = files.count - 3;
    if (num > 0){
      return true;
    }else{
      return false;
    }
  },

  // return only latest 3 posts
  filePosts: function() {
    var filePosts = mybubbles.Files.toJSON();
    var latestFilePosts = filePosts.slice(0, 3);
    return latestFilePosts;
  },
  getNumUpdates: function() {
    return Session.get('numUpdates');
  }, 

  showMoreUpdates: function(numUpdates) {
    if(Session.get('numUpdates') != 0 && numUpdates > Session.get('numUpdates'))
      return true;
    else
      return false;
  },

  postPropertiesBackboneEvent: function(){
    //bubbleDep.depend();
    var eventPosts = _.sortBy(mybubbles.Events.getJSON(), function(obj){
      return obj.dateTime;
    });
    var topEventPosts = eventPosts.slice(0, 3);
    return {
      'posts': topEventPosts,
      'postType': 'event',
      'word1': 'upcoming'
    }
  },

  postPropertiesBackboneDiscussion: function(){
    var discussionPosts = mybubbles.Discussions.getJSON();
    var topDiscussionPosts = discussionPosts.slice(0, 3);
    return {
      'posts': topDiscussionPosts,
      'postType': 'discussion',
      'word1': 'active'
    }
  },

  postPropertiesBackboneFile: function(){
    var filePosts = mybubbles.Files.getJSON();
    var topFilePosts = filePosts.slice(0, 3);
    return {
      'posts': topFilePosts,
      'postType': 'file',
      'word1': 'latest'
    }
  },
  showUpdates: function() {
    if(Session.get(currentBubbleId+'testNumUpdates'))
      return true;
    return false;
  }
});

Template.bubblePageBackbone.events({
  'click .clear-updates': function() {
    var updates = Updates.find({bubbleId: currentBubbleId, userId: Meteor.userId(), read:false}).fetch();
    _.each(updates, function(update) {
      Meteor.call('setRead', update);
      Session.set(currentBubbleId+'testNumUpdates',0);
    });
  },

  'click .more-updates': function() {
    Session.set('updatesToShow', 0);
  }
});

var bubbleHomeHelper = function() {
  mybubbles = new BubbleData.MyBubbles({
    bubbleId: currentBubbleId,
    limit: 3,
    fields: ['title', 'profilePicture', 'category', 'bubbleType'],

    events: {
      limit: 3,
      fields: ['name', 'author', 'submitted', 'postType', 'bubbleId', 'dateTime', 'commentsCount', 'attendees', 'viewCount', 'userId','location']
    },

    discussions: {
      limit: 3,
      fields: ['name', 'author', 'submitted', 'postType', 'bubbleId', 'dateTime', 'commentsCount', 'viewCount', 'userId','lastCommentTime']
    },

    files: {
      limit: 3,
      fields: ['name', 'author', 'submitted', 'postType', 'bubbleId', 'dateTime', 'commentsCount', 'viewCount', 'userId','lastCommentTime','numDownloads']
    },

    members: {
      limit: 0,
      fields: ['username', 'name', 'profilePicture', 'userType']
    },

    admins: {
      limit: 0,
      fields: ['username', 'name', 'profilePicture', 'userType']
    },

    applicants: {
      limit: 0,
      fields: ['username', 'name', 'profilePicture', 'userType']
    },

    invitees: {
      limit: 0,
      fields: ['username', 'name', 'profilePicture', 'userType']
    },

    callback: function(){
      console.log('Bubbledata changed');
      bubbleHomeDep.changed();
      Session.set('isLoading', false);
    }
  });
};
