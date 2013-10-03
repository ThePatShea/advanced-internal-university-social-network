Template.bubbleDiscussionPageBackbone.created = function(){
  Session.set("isLoading", true);

  bubbleDep = new Deps.Dependency;

  //Session.set("isLoading", true);
 //var bubble = Bubbles.findOne( Session.get('currentBubbleId') );

  currentBubbleId = window.location.pathname.split("/")[2];

  mybubbles = new BubbleData.MyBubbles({
    bubbleId: currentBubbleId,
    limit: 10,
    fields: ['title', 'profilePicture', 'category', 'bubbleType'],

    events: {
      limit: 1,
      fields: ['name', 'author', 'submitted', 'postType', 'bubbleId', 'dateTime', 'commentsCount', 'attendees']
    },

    discussions: {
      limit: 10,
      fields: ['name', 'author', 'submitted', 'postType', 'bubbleId', 'dateTime', 'commentsCount', 'viewCount']
    },

    files: {
      limit: 1,
      fields: ['name', 'author', 'submitted', 'postType', 'bubbleId', 'dateTime', 'commentsCount']
    },

    members: {
      limit: 1,
      fields: ['username', 'name', 'profilePicture']
    },

    admins: {
      limit: 1,
      fields: ['username', 'name', 'profilePicture']
    },

    applicants: {
      limit: 1,
      fields: ['username', 'name', 'profilePicture']
    },

    invitees: {
      limit: 1,
      fields: ['username', 'name', 'profilePicture']
    },

    callback: function(){
      console.log('Bubbledata changed');
      bubbleDep.changed();
      Session.set('isLoading', false);
    }
  });
}


Template.bubbleDiscussionPageBackbone.rendered = function(){

var currentUrl  =  window.location.pathname;
var urlArray    =  currentUrl.split("/");
var currentBubbleId  =  urlArray[2];
discussionsHandle = Meteor.subscribe('discussions', currentBubbleId, function() {
    Session.set("isLoading", false);
  });

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
        limit: 1,
        fields: ['name', 'author', 'submitted', 'postType', 'bubbleId', 'dateTime', 'commentsCount', 'attendees']
      },

      discussions: {
        limit: 10,
        fields: ['name', 'author', 'submitted', 'postType', 'bubbleId', 'dateTime', 'commentsCount', 'viewCount']
      },

      files: {
        limit: 1,
        fields: ['name', 'author', 'submitted', 'postType', 'bubbleId', 'dateTime', 'commentsCount']
      },

      members: {
        limit: 1,
        fields: ['username', 'name', 'profilePicture']
      },

      admins: {
        limit: 1,
        fields: ['username', 'name', 'profilePicture']
      },

      applicants: {
        limit: 1,
        fields: ['username', 'name', 'profilePicture']
      },

      invitees: {
        limit: 1,
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





Template.bubbleDiscussionPageBackbone.helpers({
  getCurrentBubbleBackbone: function(){
    var bubble = mybubbles.bubbleInfo.toJSON();
    return bubble;
  },
  //Get posts assigned to this bubble
  getDiscussionPosts: function(){
    var currentUrl  =  window.location.pathname;
    var urlArray    =  currentUrl.split("/");
    var currentBubbleId  =  urlArray[2];

    //return Posts.find({bubbleId: currentBubbleId, postType:'discussion'}, {sort: {lastCommentTime:  -1} }); 
    return mybubbles.Discussions.getJSON();  
  },

  postPropertiesBackboneDiscussion: function(){
    var discussionPosts = mybubbles.Discussions.getJSON();
    var topDiscussionPosts = discussionPosts.slice(0, 3);
    return {
      'posts': topDiscussionPosts,
      'postType': 'discussion',
      'word1': 'active'
    }
  }

});

