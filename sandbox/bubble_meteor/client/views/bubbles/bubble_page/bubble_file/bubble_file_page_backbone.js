Template.bubbleFilePageBackbone.destroyed = function() {
  delete bubbleFileDep;
}

Template.bubbleFilePageBackbone.created = function(){
  Session.set("isLoading", true);

  bubbleFileDep = new Deps.Dependency;

  //Session.set("isLoading", true);
 //var bubble = Bubbles.findOne( Session.get('currentBubbleId') );

  currentBubbleId = window.location.pathname.split("/")[2];

  bubbleFileHelper();

}

Template.bubbleFilePageBackbone.rendered = function() {
  // var currentUrl  =  window.location.pathname;
  // var urlArray    =  currentUrl.split("/");
  // var currentBubbleId  =  urlArray[2];
  // filesHandle = Meteor.subscribe('files', currentBubbleId, function() {
  //   Session.set("isLoading", false);
  // });

  if(currentBubbleId != window.location.pathname.split("/")[2])
  {
    console.log('Bubble changed');
    currentBubbleId = window.location.pathname.split("/")[2];

    var isMemberAjax = $.ajax({url: '/2013-09-11/ismember?bubbleid=' + currentBubbleId + '&userid=' + Meteor.userId()});
    var isAdminAjax = $.ajax({url: '/2013-09-11/isadmin?bubbleid=' + currentBubbleId + '&userid=' + Meteor.userId()});
    if(isMemberAjax.responseText == 'False' && isAdminAjax.responseText == 'False'){
      Meteor.Router.to('bubblePublicPage', bubble._id);
    }
    
    bubbleFileHelper();
  }
}

Template.bubbleFilePageBackbone.helpers({
  getCurrentBubbleBackbone: function(){
    var bubble = mybubbles.bubbleInfo.toJSON();
    return bubble;
  },
  //Get posts assigned to this bubble
  getFilePosts: function(){
    bubbleFileDep.depend();
    var currentUrl  =  window.location.pathname;
    var urlArray    =  currentUrl.split("/");
    var currentBubbleId  =  urlArray[2];

    //return Posts.find({bubbleId: currentBubbleId, postType:'file'}, {/*limit: filesHandle.limit(),*/ sort: {lastDownloadTime: -1} });
    return mybubbles.Files.getJSON();
  },

  postPropertiesBackboneFile: function(){
    // bubbleDep.depend();
    // var discussionPosts = mybubbles.Discussions.getJSON();
    // var topDiscussionPosts = discussionPosts.slice(0, 3);
    return {
      //'posts': topDiscussionPosts,
      'postType': 'file',
      'word1': 'active'
    }
  },

  pagination: function() {
    if(mybubbles.Files.getNumPages() > 1)
      return true;
    return false;
  },

  pages: function() {
    var retVal = []
      if(mybubbles != undefined)
      {
        for(var i=0; i<mybubbles.Files.getNumPages(); i++)
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
      if(this == mybubbles.Files.getCurrentPage()+1)
      {
        return 'active';
      }
  }
    return '';
  }

});



Template.bubbleFilePageBackbone.events({
  'click .pageitem': function(e) {
    Session.set('isLoading',true);
    console.log("Files PAGEITEM: ", e.target.id);
    mybubbles.Files.fetchPage(parseInt(e.target.id)-1, function(res){
      bubbleFileDep.changed();
      Session.set('isLoading',false);
      console.log("Discussions CALLED", res);
    });
  },
  'click .prev': function() {
    Session.set('isLoading',true);
    mybubbles.Files.fetchPrevPage(function(res){
      bubbleFileDep.changed();
      Session.set('isLoading',false);
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
    Session.set('isLoading',true);
    mybubbles.Files.fetchNextPage(function(res){
      bubbleFileDep.changed();
      Session.set('isLoading',false);
      console.log("CALLED", res);
    });
  }
});

var bubbleFileHelper = function() {
  if(typeof mybubbles === "undefined")
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
        limit: 0,
        fields: ['name', 'author', 'submitted', 'postType', 'bubbleId', 'dateTime', 'commentsCount', 'viewCount', 'userId']
      },

      files: {
        limit: 10,
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
        bubbleFileDep.changed();
        Session.set('isLoading', false);
      }
    });
  }
  else
  {
    mybubbles.Files.setLimit(10, function(){
      console.log("File Limit set to '10'");
      mybubbles.Files.fetchPage(mybubbles.Files.getCurrentPage(),function(){
        bubbleFileDep.changed();
        Session.set('isLoading', false);
      });
    });
  }
};
