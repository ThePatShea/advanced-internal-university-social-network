Meteor.Router.add({
  //Login from authentication system
  '/login': 'loginPage',
  '/welcome': 'welcomePage',
  '/loggedOut': 'loggedOut',
  '/testauth/:_username/:_secret': {
    to: 'secretLogin',
    and: function(username, secret){
      Session.set('userSecret', secret);
      Session.set('usernameSecret', username);
    }
  },

  //Onboarding page
  '/onboarding': 'onboarding',

  '/browser_unsupported': {
    to: 'browserUnsupported'
  },

  // Bubbles Related Routes
    '/mybubbles/:_id/home': {
      to: 'bubblePage', 
      and: function(id) {
        var prevBubble  =  Session.get('currentBubbleId');
        Session.set('currentBubbleId', id); 
        var currBubble  =  Session.get('currentBubbleId');

        if (currBubble != prevBubble) {
          Session.set('bubbleLoading', 'true');  // Handles loading graphic
        }
      }
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
    '/explore/:id/home': {
      to: 'explorePage',
      and: function(id){Session.set('currentExploreId', id);}
    },
    '/explore/:_expId/posts/:_pId': {
      to: 'explorePostPage',
      and: function(expId, pId){
        Session.set('currentExploreId', expId);
        Session.set('currentPostId', pId);
      }
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
      return 'welcomePage';
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
/*
    var bubbles = Bubbles.find({$or: [{'users.members': Meteor.userId()}, {'users.admins': Meteor.userId()}]}).fetch();
    if(bubbles.length > 0) {
      Meteor.Router.to('bubblePage',bubbles[0]._id);
      return 'bubblePage';
    }else{
      return 'searchBubbles';
    }
    return page;
*/
  //  Meteor.Router.to('dashboard');
    return 'dashboard';
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
  },
  'setNumUpdatesTo3': function(page){
    Session.set('numUpdates',3);
    return page;
  },
  'browserSupported': function(page){
    var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
        // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
    var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
    var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
        // At least Safari 3+: "[object HTMLElementConstructor]"
    var isChrome = !!window.chrome && !isOpera;              // Chrome 1+
    var isIE = /*@cc_on!@*/false || document.documentMode;   // At least IE6

    if($(window).width() > 764){

      if(!(isFirefox || isSafari || isChrome)){
        //$(location).attr('href', 'https://test.emorybubble.com/browser_unsupported');
        return '/browser_unsupported';
      }
      else{
        //console.log('Browser supported.');
        return page;
      }
    }
    else{
      return page;
    }
  }
});

//Partially filter pages that are not bubble related
Meteor.Router.filter('belongToBubble', {except: ['searchAll', 'searchUsers', 'searchBubbles', 'searchDiscussions', 'searchEvents',  'searchFiles', 'bubbleSubmit']});
//Add Lvl 3 pages here
Meteor.Router.filter('level3Permissions', {only: ['flagsList', 'userlog']});
Meteor.Router.filter('clearErrors');
Meteor.Router.filter('checkLoginStatus', {except: ['secretLogin', 'loggedOut', 'loginPage', 'welcomePage', 'browserCheck', 'browserUnsupported']});
Meteor.Router.filter('browserSupported', {except: ['browserUnsupported']});
//Ensures that user is routed to either the mybubbles page or search bubbles page
Meteor.Router.filter('routeWhenLogin', {only: ['/']});
//Ensures that user is not allowed to edit or create a post if bubble type is super and user type is not superuser 
Meteor.Router.filter('hasSuperBubblePermissions', {only: ['discussionSubmit', 'eventSubmit', 'fileSubmit', 'discussionEdit', 'eventEdit', 'fileobjectEdit']})
//Checks if page has a potential increase in view count
Meteor.Router.filter('increaseViewCount', {only: ['postPage', 'discussionEdit', 'eventEdit', 'fileobjectEdit']});
Meteor.Router.filter('setNumUpdatesTo3', {only: ['dashboard','bubblePage']});
