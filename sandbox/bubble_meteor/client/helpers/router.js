Meteor.Router.add({
  //Login from authentication system
  '/login': 'loginPage',

  // Bubbles Related Routes
    '/mybubbles/:_id/home': {
      to: 'bubblePage', 
      and: function(id) { Session.set('currentBubbleId', id); }
    },
    '/mybubbles/:_id/event': {
      to: 'bubbleEventPage', 
      and: function(id) { Session.set('currentBubbleId', id); }
    },
    '/mybubbles/:_id/discussion': {
      to: 'bubbleDiscussionPage', 
      and: function(id) { Session.set('currentBubbleId', id); }
    },
    '/mybubbles/:_id/file': {
      to: 'bubbleFilePage', 
      and: function(id) { Session.set('currentBubbleId', id); }
    },
    '/mybubbles/:_id/public': {
      to: 'bubblePublicPage', 
      and: function(id) { Session.set('currentBubbleId', id); }
    },
    '/mybubbles/:_id/edit': {
      to: 'bubbleEdit',
      and: function(id) { Session.set('currentBubbleId', id); }
    }, 
    '/mybubbles/:_id/members': {
      to: 'bubbleMembersPage',
      and: function(id) { Session.set('currentBubbleId', id); }
    },


  // Posts Related Routes
    '/mybubbles/:_bId/posts/:_pId': {
      to: 'postPage', 
      and: function(bId, pId) { Session.set('currentBubbleId', bId); Session.set('currentPostId', pId); }
    },
    '/mybubbles/:_bId/posts/:_pId/edit/discussion': {
      to: 'discussionEdit', 
      and: function(bId, pId) { Session.set('currentBubbleId', bId); Session.set('currentPostId', pId); }
    },
    '/mybubbles/:_bId/posts/:_pId/edit/event': {
      to: 'eventEdit', 
      and: function(bId, pId) { Session.set('currentBubbleId', bId); Session.set('currentPostId', pId); }  
    },
    '/mybubbles/:_bId/posts/:_pId/edit/file': {
      to: 'fileobjectEdit',
      and: function(bId, pId) { Session.set('currentBubbleId', bId); Session.set('currentPostId', pId);}
    },


  // Creation Related Routes
    '/mybubbles/:_id/create/discussion': {
      to: 'discussionSubmit',
      and: function(id) { Session.set('currentBubbleId', id), Session.set('currentPostId', null); }
    },
    '/mybubbles/:_id/create/event': {
      to: 'eventSubmit',
      and: function(id) { Session.set('currentBubbleId', id); }
    }, 
    '/mybubbles/:_id/create/file': {
      to: 'fileSubmit',
      and: function(id) { Session.set('currentBubbleId', id); }
    },
    '/mybubbles/create/bubble': 'bubbleSubmit',

    '/settings/invites': 'invitationsPage',

    '/settings/about': 'about',


  // User Profile Related Routes
    '/settings/userprofile/:id': {
      to: 'userProfile',
      and: function(id) { Session.set('selectedUserId',id); }
    },

    '/editprofile/:id': {
      to: 'userProfileEdit',
      and: function(id) { Session.set('selectedUserId',id)}
    },

    '/authenticateduser/:secret': {
      to: 'loginPage',
      and: function(secret) { Session.set('secret', secret)}
    },
 

  // Search Related Routes
    '/search/all': 'searchAll',
    '/search/users': 'searchUsers',
    '/search/bubbles': 'searchBubbles',
    '/search/discussions': 'searchDiscussions',
    '/search/events': 'searchEvents',
    '/search/files': 'searchFiles',


  //Explore Related Routes
    '/explore/create': 'exploreSubmit',
    '/explore/:id': {
      to: 'explorePage',
      and: function(id){Session.set('currentExplore', id);}
    },
    '/explore':  'exploreAll',



  // Flags Related Routes
    '/flags/all': 'flagsList',


  // Analytics Related Routes
    '/analytics': 'userlog',

  // Dashboard
    '/dashboard': 'dashboard',
  

  // Etc Routes
    //Capturing rogue urls, hopefully this will be a 404 page in the future
    '/': '/',
    '/bubblevisor': {
      to: 'bubblevisor'
    },
    '*': '404NotFound'
});

Meteor.Router.filters({
  'clearErrors': function(page) {
    clearErrors();
    return page;
  },
  'checkLoginStatus': function(page) {
    if(Meteor.userId()){
      //This checks if user logged in after an inactivity of 1 hour.
      //This is done here as it is at the client side and has access
      //to the hack around by using LocalCollections.collection.docs
      var hasLoggedIn = false;
      var oldLogCollection = Userlogs.find();
      var oldLogList = _.toArray(oldLogCollection.collection.docs);
      if(oldLogList.length > 0) {
        var timestamp = oldLogList[oldLogList.length-1].submitted;
        //Checks if lastActionTimestamp of user is more than an hour ago
        if(moment(new Date().getTime()).diff(moment(timestamp), 'minutes', true) >= 5){
          hasLoggedIn = true;
        }
      }else{
        hasLoggedIn = true;
      }
        
      //Logs the page that the user has switched to
      Meteor.call('createLog', page, hasLoggedIn);
      return page;
    }else if(Meteor.loggingIn()) {
      return 'loading';
    }else {
      return 'loginPage';
    }
  },
  'belongToBubble': function(page) {
    if(window.location.pathname.match('mybubbles')) {
      if(Meteor.user() && '3' != Meteor.user().userType){
        var bubble = Bubbles.findOne(Session.get('currentBubbleId'));
        if(bubble) {
          if(!_.contains(bubble.users.admins, Meteor.userId()) && !_.contains(bubble.users.members, Meteor.userId())) {
            return 'bubblePublicPage';
          }
        }
      }
    }
    return page;
  },
  'routeWhenLogin': function(page) {
    var bubbles = Bubbles.find({$or: [{'users.members': Meteor.userId()}, {'users.admins': Meteor.userId()}]}).fetch();
    if(bubbles.length > 0) {
      Meteor.Router.to('bubblePage',bubbles[0]._id);
      return 'bubblePage';
    }else{
      return 'searchBubbles';
    }
    return page;
  },
  'hasSuperBubblePermissions': function(page) {
    if('super' == Bubbles.findOne(Session.get('currentBubbleId')).bubbleType){
      if(Meteor.user() && ('2' == Meteor.user().userType || '3' == Meteor.user().userType)){
        return page;
      }else{
        Meteor.Router.to('bubblePage',Session.get('currentBubbleId'));
        return 'bubblePage';
      }
    }else{
      return page;
    }
  },
  'increaseViewCount': function(page) {
    Meteor.call('incViewCount', Session.get('currentPostId'));
    return page;
  },
  'level3Permissions': function(page){
    if(Meteor.user() && '3' == Meteor.user().userType) {
      return page;
    }
    return '/';
  }
});

//Partially filter pages that are not bubble related
Meteor.Router.filter('belongToBubble', {except: ['searchAll', 'searchUsers', 'searchBubbles', 'searchDiscussions', 'searchEvents',  'searchFiles', 'bubbleSubmit']});
//Add Lvl 3 pages here
Meteor.Router.filter('level3Permissions', {only: ['flagsList', 'userlog']});
Meteor.Router.filter('clearErrors');
Meteor.Router.filter('checkLoginStatus');
//Ensures that user is routed to either the mybubbles page or search bubbles page
Meteor.Router.filter('routeWhenLogin', {only: ['/']});
//Ensures that user is not allowed to edit or create a post if bubble type is super and user type is not superuser 
Meteor.Router.filter('hasSuperBubblePermissions', {only: ['discussionSubmit', 'eventSubmit', 'fileSubmit', 'discussionEdit', 'eventEdit', 'fileobjectEdit']})
//Checks if page has a potential increase in view count
Meteor.Router.filter('increaseViewCount', {only: ['postPage', 'discussionEdit', 'eventEdit', 'fileobjectEdit']})
