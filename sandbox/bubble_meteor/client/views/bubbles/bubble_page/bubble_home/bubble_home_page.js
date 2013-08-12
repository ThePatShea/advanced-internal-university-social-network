//the events past 4 hours will not be listed on the event page
referenceDateTime = moment().add('hours',-4).valueOf();

Template.bubblePage.created = function() {
 var bubble = Bubbles.findOne( Session.get('currentBubbleId') );

 if(!_.contains(bubble.users.admins, Meteor.userId()) && !_.contains(bubble.users.members, Meteor.userId())) {
   Meteor.Router.to('bubblePublicPage', bubble._id);
 }
}


Template.bubblePage.helpers({ 

  //Get posts assigned to this bubble
  isLoading: function() {
    var bubbleLoading = Session.get('bubbleLoading');

    if (bubbleLoading == 'true') {
      return true;
    } else {
      return false;
    }
  },
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
  }
});

Template.bubblePage.events({
  'btn .clear-updates': function() {
    Meteor.call('clearUpdates', Session.get('currentBubbleId'));
  }
});
