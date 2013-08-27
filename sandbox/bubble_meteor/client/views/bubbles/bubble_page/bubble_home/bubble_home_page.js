//the events past 4 hours will not be listed on the event page
referenceDateTime = moment().add('hours',-4).valueOf();

Template.bubblePage.created = function() {
 var bubble = Bubbles.findOne( Session.get('currentBubbleId') );

 if(typeof bubble != "undefined" &&
    (!_.contains(bubble.users.admins, Meteor.userId()) && !_.contains(bubble.users.members, Meteor.userId()) )
   ) {
   Meteor.Router.to('bubblePublicPage', bubble._id);
 }
}


Template.bubblePage.rendered = function() {
  //var bubble = Bubbles.findOne( Session.get('currentBubbleId') );
  var bubbleId = window.location.pathname.split('/')[2];
  Meteor.subscribe('singleBubble', bubbleId);
  var bubble = Bubbles.findOne({_id: bubbleId});

  Meteor.subscribe('bubbleHomeDiscussions', bubbleId);
  Meteor.subscribe('bubbleHomeEvents', bubbleId);
  Meteor.subscribe('bubbleHomeFiles', bubbleId);
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

  numMoreEvents: function(){
    var num = Posts.find({bubbleId:Session.get('currentBubbleId'), postType:'event', dateTime: {$gt: referenceDateTime}}).count() - 3;
    return num;
  },
  hasMoreDiscussions: function() {
    var num = Posts.find({bubbleId:Session.get('currentBubbleId'), postType:'discussion'}).count() - 3;
    if (num > 0){
      return true;
    }else{
      return false;
    }
  },
  numMoreDiscussionsCount: function(){
    var num = Posts.find({bubbleId:Session.get('currentBubbleId'), postType:'discussion'}).count() - 3;
    return num;
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
  getNumUpdates: function() {
    return Session.get('numUpdates');
  }, 

  showMoreUpdates: function(numUpdates) {
    if(Session.get('numUpdates') != 0 && numUpdates > Session.get('numUpdates'))
      return true;
    else
      return false;
  },
});

Template.bubblePage.events({
  'click .clear-updates': function() {
    var updates = Updates.find({bubbleId: Session.get('currentBubbleId'), userId: Meteor.userId(), read:false}).fetch();
    _.each(updates, function(update) {
      Meteor.call('setRead', update);
    });
  },

  'click .more-updates': function() {
    Session.set('numUpdates', 0);
    console.log(Session.get('numUpdates'));
  }
});
