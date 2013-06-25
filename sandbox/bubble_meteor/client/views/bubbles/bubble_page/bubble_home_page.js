//determin the scale of the past events shown to users
currentDateTime = moment().valueOf();
referenceDateTime = moment().add('hours',-4).valueOf();

Template.bubblePage.helpers({ 

  //Get posts assigned to this bubble
  eventsCount: function() {
    return Posts.find({bubbleId:Session.get('currentBubbleId'), postType:'event', dateTime: {$gt: referenceDateTime}}).count() - 3;
  },
  discussionsCount: function() {
    return Posts.find({bubbleId:Session.get('currentBubbleId'), postType:'discussion'}).count() - 3;
  },
  filesCount: function() {
    return Posts.find({bubbleId:Session.get('currentBubbleId'), postType:'file'}).count() - 3;
  },

  // check if there are more posts to view
  hasMoreEvents: function() {
    var num1 = Posts.find({bubbleId:Session.get('currentBubbleId'), postType:'event', dateTime: {$gt: referenceDateTime}}).count() - 3;
    if (num1 > 0){
      return true;
    }else{
      return false;
    }
  },
  hasMoreDiscussions: function() {
    var num2 = Posts.find({bubbleId:Session.get('currentBubbleId'), postType:'discussion'}).count() - 3;
    console.log(num2);
    if (num2 > 0){
      return true;
    }else{
      return false;
    }
  },
  hasMoreFiles: function() {
    var num3 = Posts.find({bubbleId:Session.get('currentBubbleId'), postType:'file'}).count() - 3;
    if (num3 > 0){
      return true;
    }else{
      return false;
    }
  },

  // return only latest 3 posts
  eventPosts: function() {
    return Posts.find({bubbleId:Session.get('currentBubbleId'), postType:'event', dateTime: {$gt: referenceDateTime}},{limit: 3}).fetch();
  },
  discussionPosts: function() {
    return Posts.find({bubbleId:Session.get('currentBubbleId'), postType:'discussion'},{limit: 3}).fetch();
  },
  filePosts: function() {
    return Posts.find({bubbleId:Session.get('currentBubbleId'), postType:'file'},{limit: 3}).fetch();
  }

});
