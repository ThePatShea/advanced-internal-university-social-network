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
      fields: ['name', 'author', 'submitted', 'postType', 'bubbleId', 'dateTime', 'commentsCount', 'viewCount', 'children']
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
        fields: ['name', 'author', 'submitted', 'postType', 'bubbleId', 'dateTime', 'commentsCount', 'viewCount', 'children']
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
    bubbleDep.depend();
    var currentUrl  =  window.location.pathname;
    var urlArray    =  currentUrl.split("/");
    var currentBubbleId  =  urlArray[2];

    //return Posts.find({bubbleId: currentBubbleId, postType:'discussion'}, {sort: {lastCommentTime:  -1} }); 
    return mybubbles.Discussions.getJSON();  
  },

  postPropertiesBackboneDiscussion: function(){
    bubbleDep.depend();
    var discussionPosts = mybubbles.Discussions.getJSON();
    var topDiscussionPosts = discussionPosts.slice(0, 3);
    return {
      'posts': topDiscussionPosts,
      'postType': 'discussion',
      'word1': 'active'
    }
  },

  pages: function() {
    var retVal = []
      if(mybubbles != undefined)
      {
        for(var i=0; i<mybubbles.Discussions.getNumPages(); i++)
        {
          retVal.push(i+1);
        }
      }
      else
      {
        retVal = [1];
      }
    return retVal;
  },

  isActivePage: function(n) {
  if(mybubbles != undefined)
  {
      if(this == mybubbles.Discussions.getCurrentPage()+1)
      {
        return 'active';
      }
  }
    return '';
  }

});



Template.bubbleDiscussionPageBackbone.events({
  'click .pageitem': function(e) {
    console.log("Discussion PAGEITEM: ", e.target.id);
    mybubbles.Discussions.fetchPage(parseInt(e.target.id)-1, function(res){
      bubbleDep.changed();
      console.log("Discussions CALLED", res);
    });
  },
  'click .prev': function() {
    mybubbles.Discussions.fetchPrevPage(function(res){
      bubbleDep.changed();
      console.log("CALLED", res);
    });
    //var currentPage = es.getCurrentPage();
    //es.fetchPage(currentPage - 1);
    // es.explorePosts.on("change", function() {
    //  console.log("explore posts changed");
    //  exploreDep.changed();
    // });
    
  },
  'click .next': function() {
    mybubbles.Discussions.fetchNextPage(function(res){
      bubbleDep.changed();
      console.log("CALLED", res);
    });
  }
});

