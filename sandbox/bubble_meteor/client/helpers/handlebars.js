Handlebars.registerHelper('pluralize', function(n, thing, between) {
  if (between == undefined)
    between = '';

  // Fairly simple pluralizer
  if(thing == 'person'){
    if (n === 1) {
      return '1' + ' ' + between + ' ' + 'person';
    } else {
      return n + ' ' + between + ' ' + 'people';
    }
  }else{
    if (n === 1) {
      return '1' + ' ' + between + ' ' + thing;
    } else {
      return n + ' ' + between + ' ' + thing + 's';
    }
  }
});

var getPosts = function(inputPostType) {
  var params_find  =  {bubbleId: Session.get('currentBubbleId'), postType: inputPostType}

  if (inputPostType == 'event') {
    params_find.dateTime  =  {$gt: moment().add('hours',-4).valueOf()}
    var params_sort       =  {dateTime:     1}
  } else if (inputPostType == 'file') {
    var params_sort       =  {lastDownloadTime: -1}
  } else {
    var params_sort       =  {lastCommentTime:  -1}
  }

  return Posts.find(params_find, {limit: 3, sort: params_sort}).fetch();
}

Handlebars.registerHelper('siteLoading', function() {
  var siteLoading = Session.get('siteLoading');

  if (siteLoading == 'false') {
    return false;
  } else {
    return true;
  }
});

Handlebars.registerHelper('isLoading', function() {
  if(Session.get('isLoading')) {return true;}
  return false
});


Handlebars.registerHelper('getUserTypeName', function(userType) {
  return userTypes[userType];
});

Handlebars.registerHelper('getSelectedUserProfilePic', function(userId) {
  var user = Meteor.users.findOne(userId);
  return user && user.profilePicture;
});

Handlebars.registerHelper('getSelectedUserName', function(userId) {
  var user = Meteor.users.findOne(userId);
  return user && user.username;
});

Handlebars.registerHelper('getSelectedName', function(userId) {
  var user = Meteor.users.findOne(userId);
  return user && user.name;
});

Handlebars.registerHelper('postProperties', {
    discussion : {
        posts      : function() { return getPosts('discussion'); }
      , postType   : 'discussion'
      , word1      : 'active'
    }
  , event      : {
        posts      : function() { return getPosts('event'); }
      , postType   : 'event'
      , word1      : 'upcoming'
    }
  , file       : {
        posts      : function() {
          var posts = getPosts('file');
          
          // Updates missing fields, if necessary
          _.each(posts, function(post) {
            if (!post.numDownloads || !post.lastDownloadTime) {
              if (!post.lastDownloadTime)
                post.lastDownloadTime = new Date().getTime();
                
              if (!post.numDownloads)
                post.numDownloads = 0;

              Posts.update(
                  {_id : post._id}
                , {$set: {
                      lastDownloadTime : post.lastDownloadTime
                    , numDownloads     : post.numDownloads
                  } 
              });
            }
          });

          return posts;
        }
      , postType   : 'file'
      , word1      : 'latest'
    }
});

Handlebars.registerHelper('matchPostType', function(inputPostType) {
  return this.postType == inputPostType;
});

Handlebars.registerHelper('matchObjectType', function(inputObjectType){
  if(inputObjectType == 'post'){
    if(typeof this.postType != 'undefined'){
      return true;
    }
    else{
      return false;
    }
  }
  else if(inputObjectType == 'bubble'){
    if(typeof this.category != 'undefined'){
      return true;
    }
    else{
      return false;
    }
  }
  else if(inputObjectType == 'user'){
    if(typeof this.userType != 'undefined'){
      return true;
    }
    else{
      return false;
    }
  }
  else{
    return false;
  }
});

Handlebars.registerHelper('matchSectionType', function() {
  
});

Handlebars.registerHelper('getCurrentBubble', function() {
  return Bubbles.findOne(Session.get('currentBubbleId'));
});

Handlebars.registerHelper('getCurrentPost', function() {
  return Posts.findOne(Session.get('currentPostId'));
});

Handlebars.registerHelper('isAdmin', function() {  
  var bubble = Bubbles.findOne(Session.get('currentBubbleId'));
  if(bubble)
  {
    return (Meteor.user().userType == '3') || _.contains(bubble.users.admins, Meteor.userId());
  }
  else
  {
    return -1;
  }
});

Handlebars.registerHelper('belongsToBubble', function() {
  var bubble = Bubbles.findOne(Session.get('currentBubbleId'));
  if(bubble) {
    if(_.contains(bubble.users.admins, Meteor.userId()) || _.contains(bubble.users.members, Meteor.userId())) {
      return true;
    }
  }
  return  Meteor.user().userType == '3' || false;
}); 



Handlebars.registerHelper('hasAppliedToBubble', function() {
    // var users = Bubbles.findOne(Session.get('currentBubbleId')).users;
    return _.contains(this.users.applicants, Meteor.userId());
});

Handlebars.registerHelper('isInvitedToBubble', function() {
    // var users = Bubbles.findOne(Session.get('currentBubbleId')).users;
    if (this.users)
      return _.contains(this.users.invitees, Meteor.userId());
    else
      return -1;
});

Handlebars.registerHelper('ownsPost', function() {
 var bubble = Bubbles.findOne(this.bubbleId);
  if(bubble) {
    userList = bubble.users.admins;
    userList.push(this.userId);
    return (Meteor.user().userType == '3') || _.contains(userList, Meteor.userId())
  }   
});

Handlebars.registerHelper('ownsPostExplore', function() {
  if ( this.postAsId == Meteor.userId() ) {
    return true;
  } else {
    return false;
  }
});

Handlebars.registerHelper('submittedText', function(submitted){
  return moment(new Date(submitted).toString()).fromNow().toUpperCase();
});

Handlebars.registerHelper('timestampToMonthShort', function(dateTime){
  return moment(new Date(dateTime).toString()).format('MMM');
});

Handlebars.registerHelper('timestampToDayLong', function(dateTime){
  return moment(new Date(dateTime).toString()).format('DD');
});

Handlebars.registerHelper('timestampToDateLong', function(dateTime){
  return moment(new Date(dateTime).toString()).format('dddd, MMMM D, YYYY');
});

Handlebars.registerHelper('timestampToTime', function(dateTime){
  return moment(new Date(dateTime).toString()).format('h:mma');
});

Handlebars.registerHelper('timestampToFromNow', function(dateTime){
  return moment(new Date(dateTime).toString()).fromNow();
});

Handlebars.registerHelper('numOfAttendees', function(){
  if(typeof this.attendees != 'undefined'){
    return this.attendees.length;
  }
  else{
    return -1;
  }
});

Handlebars.registerHelper('numOfMembers', function(){
  if(typeof this.users != 'undefined'){
    return (this.users.members.length + this.users.admins.length);
  }
  else{
    return -1;
  }
});

Handlebars.registerHelper('toUpperCase', function(text){
  if(text) {
    return text.toUpperCase();
  }
});

Handlebars.registerHelper('getUsername', function(userId) {
  var user = Meteor.users.findOne({_id:userId.toString()});
  if(user) {
    return user.username;
  }
});

Handlebars.registerHelper('chosen', function() {
  //Checks if user has clicked on username to activate options
  if(Session.get(Session.get('currentBubbleId')+this.toString()) == this.toString()){
    return true;
  }
});

//Return errors
Handlebars.registerHelper('hasNoErrors', function() {
  if(Errors.find().count() == 0){
    return true;
  }else{
    return false;
  }
});

Handlebars.registerHelper('getBubbleUsersCount',function() {
  var bubble = Bubbles.findOne(Session.get("currentBubbleId"));

  var users = bubble.users.admins.concat(bubble.users.members);
  return users.length;
});

Handlebars.registerHelper('getLongCategory', function() {
    var currentCat = this.category;
    var category =  _.find(categories, function(cat) {
      return currentCat == cat.name_short;
    });
    if(category) {
      return category.name_long;
    }
});

Handlebars.registerHelper('convertSpacesToDashes',function(word) {
  return word.replace(" ","-");
});

Handlebars.registerHelper('decodeURI',function(uri) {
  return decodeURI(uri);
});

Handlebars.registerHelper('getTextAfterDot',function(inputText) {
  if (inputText) {
    return inputText.substr(inputText.lastIndexOf('.') + 1, inputText.length); 
  } else {
    return -1;
  }
});

Handlebars.registerHelper('getTextAfterSlash',function(inputText) {
  if (inputText) {
    var textAfterSlash = inputText.split('/');
    return textAfterSlash[1];
  } else {
    return false;
  }
});

Handlebars.registerHelper('isOnboarding', function() {
  var currentSection = window.location.pathname.split("/")[1];

  if (currentSection == "onboarding") {
    return true;
  } else {
    return false;
  }
});

Handlebars.registerHelper('isLoggedIn', function() {
  if(Meteor.user()) {
    return true;
  }
});

Handlebars.registerHelper('isLoggedIn2', function() {
  var currentPage = window.location.pathname.split("/")[1];
  if(Meteor.user() || currentPage == "login" || currentPage == "loggedOut") {
    return true;
  }
});

Handlebars.registerHelper('hasBubble', function() {
  if(Bubbles.find({$or: [{'users.members': Meteor.userId()}, {'users.admins': Meteor.userId()}]}).count() > 0){
    return true;
  }else{
    return false;
  }
});

Handlebars.registerHelper('isUser', function(userId) {
  return (userId.toString() == Meteor.userId());
});

Handlebars.registerHelper('hasSearchText', function() {
  if(Session.get('searchText') != undefined){
    return true;
  }
});

//Checks if user is lvl 2
Handlebars.registerHelper('hasLevel2Permissions', function() {
  return (Meteor.user() && Meteor.user().userType == '2');
});

//Checks if user is lvl 2 or 3
Handlebars.registerHelper('hasLevel2And3Permissions', function() {
  return (Meteor.user() && (Meteor.user().userType == '2' || Meteor.user().userType == '3'));
});

//Checks if user is lvl 3
Handlebars.registerHelper('hasLevel3Permissions', function() {
  return (Meteor.user() && Meteor.user().userType == '3');
});

//Checks if user is allowed to edit post
Handlebars.registerHelper('hasEditPermissions', function() {
  var bubble = Bubbles.findOne(Session.get('currentBubbleId'));
  if('super' == bubble.bubbleType) {
    if('2' == Meteor.user().userType || '3' == Meteor.user().userType) {
      return true;
    }
  }else{
    var post = Posts.findOne(Session.get('currentPostId'));
    if(_.contains(bubble.users.admins, Meteor.userId()) || Meteor.userId() == post.userId) {
      return true;
    }
  }
  return false
});

Handlebars.registerHelper('isSuperBubble', function() {
  return 'super' == Bubbles.findOne(Session.get('currentBubbleId')).bubbleType;
});

//Pulls compressed list of updates for each bubble
Handlebars.registerHelper('compressedUpdates', function(bubbleId, limit) {
  var updateList = Updates.find({userId: Meteor.userId(), bubbleId: bubbleId, read:false}).fetch();

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
    if(limit>0){
      return _.first(updateList.reverse(), limit);
    }else{
      return updateList.reverse();
    }
  }
});

//Pulls the count of compressed list of updates for each bubble
Handlebars.registerHelper('compressedUpdatesCount', function(bubbleId) {
  var updateList;
  if(bubbleId){
    updateList = Updates.find({userId: Meteor.userId(), bubbleId: bubbleId, read:false}).fetch();
  }else{
    updateList = Updates.find({userId: Meteor.userId(), bubbleId: Session.get('currentBubbleId'), read:false}).fetch();
  }

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
    // _.each(postUpdateList, function(type) {
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
    // });

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
    return updateList.length;
  }
});

Handlebars.registerHelper('codeComment', function() {
  return "";
});
