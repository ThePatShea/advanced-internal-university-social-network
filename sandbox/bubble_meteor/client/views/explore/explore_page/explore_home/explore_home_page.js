//the events past 4 hours will not be listed on the event page
referenceDateTime = moment().add('hours',-4).valueOf();

Template.explorePage.rendered = function(){
  var currentExploreId = window.location.pathname.split("/")[2];
  Meteor.subscribe('currentExplore', currentExploreId);
}

Template.explorePage.helpers({ 
  currentExplore: function(){
    var currentExploreId = Session.get('currentExploreId');
    var currentExplore = Explores.findOne({_id: currentExploreId});
    return currentExplore;
  },

  //Get posts assigned to this bubble
  eventsCount: function() {
    return Meteor.call('getNumOfEvents','event');
  },
  discussionsCount: function() {
    return Posts.find({bubbleId:Session.get('currentBubbleId'), postType:'discussion'}).count() - 3;
  },
  filesCount: function() {
    return Posts.find({bubbleId:Session.get('currentBubbleId'), postType:'file'}).count() - 3;
  },

  // check if there are more posts to view
  hasMoreEvents: function() {
    var num = Posts.find({bubbleId:Session.get('currentBubbleId'), postType:'event', dateTime: {$gt: referenceDateTime}}).count() - 3;
    if (num > 0){
      return true;
    }else{
      return false;
    }
  },
  hasMoreDiscussions: function() {
    var num = Posts.find({bubbleId:Session.get('currentBubbleId'), postType:'discussion'}).count() - 3;
    if (num > 0){
      return true;
    }else{
      return false;
    }
  },
  hasMoreFiles: function() {
    var num = Posts.find({bubbleId:Session.get('currentBubbleId'), postType:'file'}).count() - 3;
    if (num > 0){
      return true;
    }else{
      return false;
    }
  },

  // return only latest 3 posts
  filePosts: function() {
    return Posts.find({bubbleId:Session.get('currentBubbleId'), postType:'file'},{limit: 3}).fetch();
  },

  posts: function() {
    var explore = Explores.findOne(Session.get('currentExploreId'));
    var posts = Posts.find({exploreId: Session.get('currentExploreId'), postType: explore.exploreType}, {sort: {lastCommentTime:  -1} }).fetch();
    var validPostIds = [];
    for(var i=0; i < posts.length; i++){
      var postAsId = posts[i].postAsId;
      //console.log('Post as id: ', posts[i].postAsId, ((Bubbles.find({_id: postAsId}).count() > 0) || (Meteor.users.find({_id: postAsId}) > 0)));
      if((Bubbles.find({_id: postAsId}).count() > 0) || (Meteor.users.find({_id: postAsId}).count() > 0)){
        validPostIds.push(posts[i]._id);
      }
    }
    //console.log('Valid post ids: ', validPostIds);

    //return Posts.find({exploreId: Session.get('currentExploreId'), postType: explore.exploreType}, {sort: {lastCommentTime:  -1} });
    return Posts.find({_id: {$in: validPostIds}, postType: explore.exploreType}, {sort: {lastCommentTime: -1}});
  }
});

Template.explorePage.events({
  'btn .clear-updates': function() {
    Meteor.call('clearUpdates', Session.get('currentBubbleId'));
  }
});
