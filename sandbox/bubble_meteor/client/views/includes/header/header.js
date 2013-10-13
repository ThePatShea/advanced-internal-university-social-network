Template.header.created = function() {
  Session.set('sidebarOpen', false);
}

Template.header.helpers({
  activeRouteClass: function(routeName) {
    var pathname = window.location.pathname.split('/')[1];
    if(pathname == routeName) {
      return 'active';
    }else if(pathname == routeName) {
      return 'active';
    }
  },
  getMyBubblesUrlPath: function() {
    var bubbles = Bubbles.find({$or: [{'users.members': Meteor.userId()}, {'users.admins': Meteor.userId()}]},{sort: {'users.members': -1, 'users.admins': -1}, limit: 1}).fetch();
    if(bubbles.length > 0) {
      if(Session.get('currentBubbleId')){
        return '/mybubbles/' + Session.get('currentBubbleId') + '/home';
      }else{
        return '/mybubbles/' + bubbles[0]._id + '/home';
      }
    }else{
      return '/mybubbles/search/bubbles';
    }
  },
  checkUserType: function(userType) {
    return Meteor.user().userType == userType;
  }
});


Template.header.rendered = function() {
  //Log clicking of support in header
  $(".header-support").on("click", function() {
    //Logs the action that user is doing
    Meteor.call('createLog', 
      { action: 'click-headerSupportButton' }, 
      window.location.pathname, 
      function(error) { if(error) { throwError(error.reason); }
    });
  });

  //Log clicking of update in header
  $(".header-update").on("click", function() {
    //Logs the action that user is doing
    Meteor.call('createLog', 
      { action: 'click-headerUpdateList' }, 
      window.location.pathname, 
      function(error) { if(error) { throwError(error.reason); }
    });
  });

  //Log clicking of analytics in header
  $(".header-analytic").on("click", function() {
    //Logs the action that user is doing
    Meteor.call('createLog', 
      { action: 'click-headerAnalyticButton' }, 
      window.location.pathname, 
      function(error) { if(error) { throwError(error.reason); }
    });
  });

  //Log clicking of flagsList in header
  $(".header-flag").on("click", function() {
    //Logs the action that user is doing
    Meteor.call('createLog', 
      { action: 'click-headerFlagListButton' }, 
      window.location.pathname, 
      function(error) { if(error) { throwError(error.reason); }
    });
  });
}