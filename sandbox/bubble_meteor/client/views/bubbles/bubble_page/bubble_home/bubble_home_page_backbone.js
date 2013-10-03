//the events past 4 hours will not be listed on the event page
referenceDateTime = moment().add('hours',-4).valueOf();

Template.bubblePageBackbone.created = function() {

  bubbleDep = new Deps.Dependency;

  //Session.set("isLoading", true);
 //var bubble = Bubbles.findOne( Session.get('currentBubbleId') );

  currentBubbleId = window.location.pathname.split("/")[2];

  mybubbles = new BubbleData.MyBubbles({
    bubbleId: currentBubbleId,
    limit: 10,
    fields: ['title', 'profilePicture', 'category', 'bubbleType'],

    events: {
      limit: 10,
      fields: ['name', 'author', 'submitted', 'postType', 'bubbleId', 'dateTime', 'commentsCount', 'attendees', 'viewCount']
    },

    discussions: {
      limit: 10,
      fields: ['name', 'author', 'submitted', 'postType', 'bubbleId', 'dateTime', 'commentsCount', 'viewCount']
    },

    files: {
      limit: 10,
      fields: ['name', 'author', 'submitted', 'postType', 'bubbleId', 'dateTime', 'commentsCount', 'viewCount']
    },

    members: {
      limit: 10,
      fields: ['username', 'name', 'profilePicture']
    },

    admins: {
      limit: 10,
      fields: ['username', 'name', 'profilePicture']
    },

    applicants: {
      limit: 10,
      fields: ['username', 'name', 'profilePicture']
    },

    invitees: {
      limit: 10,
      fields: ['username', 'name', 'profilePicture']
    },

    callback: function(){
      console.log('Bubbledata changed');
      bubbleDep.changed();
      Session.set('isLoading', false);
    }
  });


 /*if(typeof bubble != "undefined" &&
    (!_.contains(bubble.users.admins, Meteor.userId()) && !_.contains(bubble.users.members, Meteor.userId()) )
   ) {
   Meteor.Router.to('bubblePublicPage', bubble._id);
 }*/
}


Template.bubblePageBackbone.rendered = function() {
  //var bubble = Bubbles.findOne( Session.get('currentBubbleId') );
  console.log('Rendered bubble page');

  //currentBubbleId = window.location.pathname.split('/')[2];




  if(currentBubbleId != window.location.pathname.split("/")[2])
  {
    console.log('Bubble chenged');
    currentBubbleId = window.location.pathname.split("/")[2];

    var isMemberAjax = $.ajax({url: '/2013-09-11/ismember?bubbleid=' + currentBubbleId + '&userid=' + Meteor.userId()});
    var isAdminAjax = $.ajax({url: '/2013-09-11/isadmin?bubbleid=' + currentBubbleId + '&userid=' + Meteor.userId()});
    if(isMemberAjax.responseText == 'False' && isAdminAjax.responseText == 'False'){
      Meteor.Router.to('bubblePublicPage', bubble._id);
    }

  mybubbles = new BubbleData.MyBubbles({
    bubbleId: currentBubbleId,
    limit: 10,
    fields: ['title', 'profilePicture', 'category', 'bubbleType'],

    events: {
      limit: 10,
      fields: ['name', 'author', 'submitted', 'postType', 'bubbleId', 'dateTime', 'commentsCount', 'attendees']
    },

    discussions: {
      limit: 10,
      fields: ['name', 'author', 'submitted', 'postType', 'bubbleId', 'dateTime', 'commentsCount']
    },

    files: {
      limit: 10,
      fields: ['name', 'author', 'submitted', 'postType', 'bubbleId', 'dateTime', 'commentsCount']
    },

    members: {
      limit: 10,
      fields: ['username', 'name', 'profilePicture']
    },

    admins: {
      limit: 10,
      fields: ['username', 'name', 'profilePicture']
    },

    applicants: {
      limit: 10,
      fields: ['username', 'name', 'profilePicture']
    },

    invitees: {
      limit: 10,
      fields: ['username', 'name', 'profilePicture']
    },

    callback: function(){
      console.log('Bubbledata changed');
      bubbleDep.changed();
      Session.set('isLoading', false);
    }
  });
  }

}

Template.bubblePageBackbone.helpers({ 
  getCurrentBubbleBackbone: function(){
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
    bubbleDep.depend();
    var eventPosts = mybubbles.Events.getJSON();
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
  }
});

Template.bubblePageBackbone.events({
  'click .clear-updates': function() {
    var updates = Updates.find({bubbleId: currentBubbleId, userId: Meteor.userId(), read:false}).fetch();
    _.each(updates, function(update) {
      Meteor.call('setRead', update);
    });
  },

  'click .more-updates': function() {
    Session.set('numUpdates', 0);
    console.log(Session.get('numUpdates'));
  }
});
