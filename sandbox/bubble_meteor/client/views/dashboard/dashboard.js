

Template.dashboard.helpers({
        getFiveExplorePosts: function() {
		    var posts = Posts.find({exploreId: {$ne: undefined} },{limit: 5, sort: {submitted: -1}}).fetch();
		    var validPostIds = [];
		    for(var i=0; i < posts.length; i++){
		      var postAsId = posts[i].postAsId;
		      //console.log('PostId, PostAsId: ', posts[i]._id, posts[i].postAsId);
		      if((Bubbles.find({_id: postAsId}).count() > 0) || (Meteor.users.find({_id: postAsId}).count() > 0)){
		        validPostIds.push(posts[i]._id);
		      }
		    }
		    //console.log('Dashboard Valid posts: ', validPostIds);
          return Posts.find({_id: {$in: validPostIds} },{limit: 5, sort: {submitted: -1}});
        },
	numBubbles: function() {
		var uid = Meteor.userId();
		var numBubbles = Bubbles.find({$or:
			[{'users.admins': {$in: [uid]}},
			{'users.members': {$in: [uid]}}
			]}).count();
		return numBubbles;
	},

	numInvites: function() {
		var uid = Meteor.userId();
		var numInvites = Bubbles.find({
			'users.invitees': {$in: [uid]}
		}).count();
		return numInvites;
	},

	numUpdates: function() {
		var updateList = Updates.find({userId: Meteor.userId(), read:false}).fetch();

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

	    Session.set('numUpdates', updateList.length);

	    return updateList.length;
	  } else {
	  	return 0;
	  }
	},

	numUpdatesMinusThree: function() {
		var updateList = Updates.find({userId: Meteor.userId(), read:false}).fetch();

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

	    return (updateList.length - Session.get('numUpdates'));
	  }
	},

	showMoreUpdates: function(numUpdates) {

		if(Session.get('numUpdates') != 0 && numUpdates > Session.get('numUpdates'))
			return true;
		else
			return false;
	},

	numComments: function() {
		var uid = Meteor.userId();
		var numComments = Comments.find({
			userId: uid
		}).count();
		return numComments;
	},

	numPosts: function() {
		var uid = Meteor.userId();
		var numPosts = Posts.find({
			userId: uid
		}).count();
		return numPosts;
	},

	numFiles: function() {
		var uid = Meteor.userId();
		var numFiles = Files.find({
			userId: uid
		}).count();
		return numFiles;
	},

	numEvents: function() {
		var uid = Meteor.userId();
		return Posts.find({'attendees': {$in: [Meteor.userId()]}}).count();
	},

	getUpdates: function() {
		var updateList = Updates.find({userId: Meteor.userId(), read:false}).fetch();

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
	    if(Session.get('numUpdates')>0){
	      return _.first(updateList.reverse(), Session.get('numUpdates'));
	    }else{
	      return updateList.reverse();
	    }
	  }
	}
});

Template.dashboard.events({
  'click .clear-updates': function() {
    var updates = Updates.find({userId: Meteor.userId(), read:false}).fetch();
    _.each(updates, function(update) {
      Meteor.call('setRead', update);
    });
  },

  'click #dashboard-icon-2a': function() {
	location.href="https://play.google.com/store/apps/details?id=io.cordova.emorybubble";
  },

  'click #dashboard-icon-2b': function() {
	location.href="https://itunes.apple.com/us/app/emory-bubble/id538091098";
  },

  'click .dashboard-more-updates': function() {
  	Session.set('numUpdates', 0);
  	console.log(Session.get('numUpdates'));
  }
});

Template.dashboard.rendered = function () {
Meteor.subscribe('fiveExplorePosts');
Meteor.subscribe('updatedPosts', Meteor.userId());

	$('.carousel').carousel();

	$('.dashboard-more-updates').click(function(){
		$('.threeUpdtes').addClass('visible-0');
		$('.allUpdates').removeClass('visible-0');
		$('.dashboard-more-updates').addClass('visible-0');
		$('.dashboard-updates').css('height',(75*Session.get('numUpdates'))+'px');
	});
};
