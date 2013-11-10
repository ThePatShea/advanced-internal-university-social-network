Template.bubbleDiscussionPageBackbone.destroyed = function() {
  delete bubbleDiscussionDep;
}

Template.bubbleDiscussionPageBackbone.created = function(){
  Session.set("isLoading", true);

  bubbleDiscussionDep = new Deps.Dependency;

  //Session.set("isLoading", true);
 //var bubble = Bubbles.findOne( Session.get('currentBubbleId') );

  currentBubbleId = window.location.pathname.split("/")[2];

  bubbleDiscussionHelper();
}


Template.bubbleDiscussionPageBackbone.rendered = function(){

/*var currentUrl  =  window.location.pathname;
var urlArray    =  currentUrl.split("/");
var currentBubbleId  =  urlArray[2];
discussionsHandle = Meteor.subscribe('discussions', currentBubbleId, function() {
    Session.set("isLoading", false);
  });*/

  if(currentBubbleId != window.location.pathname.split("/")[2])
  {
    console.log('Bubble changed');
    currentBubbleId = window.location.pathname.split("/")[2];

    var isMemberAjax = $.ajax({url: '/2013-09-11/ismember?bubbleid=' + currentBubbleId + '&userid=' + Meteor.userId()});
    var isAdminAjax = $.ajax({url: '/2013-09-11/isadmin?bubbleid=' + currentBubbleId + '&userid=' + Meteor.userId()});
    if(isMemberAjax.responseText == 'False' && isAdminAjax.responseText == 'False'){
      Meteor.Router.to('bubblePublicPage', bubble._id);
    }

    bubbleDiscussionHelper();
  }

}





Template.bubbleDiscussionPageBackbone.helpers({
  getCurrentBubbleBackbone: function(){
    var bubble = mybubbles.bubbleInfo.toJSON();
    return bubble;
  },
  //Get posts assigned to this bubble
  getDiscussionPosts: function(){
    bubbleDiscussionDep.depend();
    // var currentUrl  =  window.location.pathname;
    // var urlArray    =  currentUrl.split("/");
    // var currentBubbleId  =  urlArray[2];

    //return Posts.find({bubbleId: currentBubbleId, postType:'discussion'}, {sort: {lastCommentTime:  -1} });
    return mybubbles.Discussions.getJSON();
  },

  postPropertiesBackboneDiscussion: function(){
    //bubbleDep.depend();
    //var discussionPosts = mybubbles.Discussions.getJSON();
    //var topDiscussionPosts = discussionPosts.slice(0, 3);
    return {
      //'posts': topDiscussionPosts,
      'postType': 'discussion',
      'word1': 'active'
    }
  },

  pagination: function() {
    if(mybubbles.Discussions.getNumPages() > 1)
      return true;
    return false;
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
    Session.set('isLoading',true);
    console.log("Discussion PAGEITEM: ", e.target.id);
    mybubbles.Discussions.fetchPage(parseInt(e.target.id)-1, function(res){
      bubbleDiscussionDep.changed();
      Session.set('isLoading',false);
      console.log("Discussions CALLED", res);
    });
  },
  'click .prev': function() {
    Session.set('isLoading',true);
    mybubbles.Discussions.fetchPrevPage(function(res){
      bubbleDiscussionDep.changed();
      Session.set('isLoading',false);
      console.log("CALLED", res);
    });
  },
  'click .next': function() {
    Session.set('isLoading',true);
    mybubbles.Discussions.fetchNextPage(function(res){
      bubbleDiscussionDep.changed();
      Session.set('isLoading',false);
      console.log("CALLED", res);
    });
  }
});

var bubbleDiscussionHelper = function() {
  if (typeof mybubbles === "undefined")
  {
    mybubbles = new BubbleData.MyBubbles({
      bubbleId: currentBubbleId,
      limit: 10,
      fields: ['title', 'profilePicture', 'category', 'bubbleType'],

      events: {
        limit: 0,
        fields: ['name', 'author', 'submitted', 'postType', 'bubbleId', 'dateTime', 'commentsCount', 'attendees', 'viewCount', 'userId']
      },

      discussions: {
        limit: 10,
        fields: ['name', 'author', 'submitted', 'postType', 'bubbleId', 'dateTime', 'commentsCount', 'viewCount', 'userId']
      },

      files: {
        limit: 0,
        fields: ['name', 'author', 'submitted', 'postType', 'bubbleId', 'dateTime', 'commentsCount', 'viewCount', 'userId']
      },

      members: {
        limit: 0,
        fields: ['username', 'name', 'profilePicture', 'userType']
      },

      admins: {
        limit: 0,
        fields: ['username', 'name', 'profilePicture', 'userType']
      },

      applicants: {
        limit: 0,
        fields: ['username', 'name', 'profilePicture', 'userType']
      },

      invitees: {
        limit: 0,
        fields: ['username', 'name', 'profilePicture', 'userType']
      },

      callback: function(){
        console.log('Bubbledata changed');
        bubbleDiscussionDep.changed();
        Session.set('isLoading', false);
      }
    });
  }
  else
  {
    mybubbles.Discussions.setLimit(10, function(){
      console.log("Discussion Limit set to '10'");
      mybubbles.Discussions.fetchPage(mybubbles.Discussions.getCurrentPage(),function(){
        bubbleDiscussionDep.changed();
        Session.set('isLoading', false);
      });
    });
  }
};