//the events past 4 hours will not be listed on the event page
referenceDateTime = moment().add('hours',-4).valueOf();

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
    return Posts.find({exploreId: Session.get('currentExploreId'), postType: explore.exploreType})
  }
});

Template.explorePage.events({
  'btn .clear-updates': function() {
    Meteor.call('clearUpdates', Session.get('currentBubbleId'));
  }
});
