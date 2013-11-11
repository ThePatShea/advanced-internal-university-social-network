Template.bubbleEventPageBackbone.destroyed = function() {
  delete bubbleEventDep;
}

Template.bubbleEventPageBackbone.created = function(){
  Session.set("isLoading", true);

  console.log ("BUBBLE EVENTS PAGE CREATED!");

  // if(typeof bubbleDep !== "undefined")
  //   delete bubbleDep;
  bubbleEventDep = new Deps.Dependency;
  if(typeof goingDep === "undefined")
    goingDep = new Deps.Dependency;

  Session.set("isLoading", true);
  //var bubble = Bubbles.findOne( Session.get('currentBubbleId') );

  currentBubbleId = window.location.pathname.split("/")[2];

  bubbleEventHelper();
}


Template.bubbleEventPageBackbone.rendered = function(){
  console.log("BUBBLE EVENTS PAGE RENDERED!");
/*var currentUrl  =  window.location.pathname;
var urlArray    =  currentUrl.split("/");
var currentBubbleId  =  urlArray[2];
eventsHandle = Meteor.subscribe('events', currentBubbleId, function() {
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

    bubbleEventHelper();
  }

}




Template.bubbleEventPageBackbone.helpers({
  //Get posts assigned to this bubble
  getEventPosts: function() {
    bubbleEventDep.depend();
    var currentUrl  =  window.location.pathname;
    var urlArray    =  currentUrl.split("/");
    var currentBubbleId  =  urlArray[2];

    var retVal = mybubbles.Events.getJSON();
    return _.sortBy(retVal,function(obj){
      return obj.dateTime;
    });


    //return Posts.find({bubbleId: currentBubbleId, postType: 'event', dateTime: {$gt: moment().add('hours',-4).valueOf()}}, {/*limit: eventsHandle.limit(),*/ sort: {dateTime: 1} });
  },

  postPropertiesBackboneEvent: function(){
    //bubbleEventDep.depend();
    //var eventPosts = mybubbles.Events.getJSON();
    //var topEventPosts = eventPosts.slice(0, 3);
    return {
      //'posts': topEventPosts,
      'postType': 'event',
      'word1': 'upcoming'
    }
  },

  getCurrentBubbleBackbone: function(){
    var bubble = mybubbles.bubbleInfo.toJSON();
    return bubble;
  },

  pagination: function() {
    if(mybubbles.Events.getNumPages() > 1)
      return true;
    return false;
  },

  pages: function() {
    var retVal = []
      if(mybubbles != undefined)
      {
        for(var i=0; i<mybubbles.Events.getNumPages(); i++)
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
      if(this == mybubbles.Events.getCurrentPage()+1)
      {
        return 'active';
      }
  }
    return '';
  }
  
});



Template.bubbleEventPageBackbone.events({
  'click .pageitem': function(e) {
    Session.set('isLoading',true);
    console.log("PAGEITEM: ", e.target.id);
    mybubbles.Events.fetchPage(parseInt(e.target.id)-1, function(res){
      bubbleEventDep.changed();
      Session.set('isLoading',false);
      console.log("CALLED", res);
    });
  },
  'click .prev': function() {
    Session.set('isLoading',true);
    mybubbles.Events.fetchPrevPage(function(res){
      bubbleEventDep.changed();
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
    mybubbles.Events.fetchNextPage(function(res){
      bubbleEventDep.changed();
      Session.set('isLoading',false);
      console.log("CALLED", res);
    });
  }
});

var bubbleEventHelper = function() {
  if(typeof mybubbles === "undefined")
  {
    mybubbles = new BubbleData.MyBubbles({
      bubbleId: currentBubbleId,
      limit: 3,
      fields: ['title', 'profilePicture', 'category', 'bubbleType'],

      events: {
        limit: 10,
        fields: ['name', 'author', 'submitted', 'postType', 'bubbleId', 'dateTime', 'commentsCount', 'attendees', 'viewCount', 'userId']
      },

      discussions: {
        limit: 0,
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
        bubbleEventDep.changed();
        Session.set('isLoading', false);
      }
    });
  }
  else
  {
    mybubbles.Events.setLimit(10, function(){
      console.log("Event Limit set to '10'");
      mybubbles.Events.fetchPage(mybubbles.Events.getCurrentPage(),function(){
        bubbleEventDep.changed();
        Session.set('isLoading', false);
      });
    });
  }
};