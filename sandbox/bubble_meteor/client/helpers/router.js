var mto = "";

Meteor.Router.add({
  //Login from authentication system
  '/siteAccessDenied': 'siteAccessDenied',
  '/bbexplore': 'bbExplorePage',
  //'/backboneexplore': 'explorePageBackbone',
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

  '/onboarding_walkthrough': {
    to: 'onboardingWalkThrough',
    and: function() {
    }
  },

  //'/bubbleanalytics': 'bubbleAnalytics',

  '/browser_unsupported': {
    to: 'browserUnsupported'
  },

  // Bubbles Related Routes
    '/oldmybubbles/:_id/home': {
      //to: 'bubblePage',
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
    '/mybubbles/': function() {
      // TODO: Loading flag
      var data = new SidebarData.Sidebar();
      data.getFirstBubbleId(function(bubbleId) {
        if (bubbleId) {
          Meteor.Router.to('bubblePageBackbone', bubbleId);
        } else {
          Meteor.Router.to('bubbleSubmit');
        }
      });
    },
    '/mybubbles/:id/home': {
      //to: 'bubblePage',
      to: 'bubblePageBackbone',
      and: function(id) {
        var prevBubble  =  Session.get('currentBubbleId');

        if (prevBubble != id) {
          Session.set('currentBubbleId', id);
          Session.set('bubbleLoading', 'true');  // Handles loading graphic
        }
      }
    },
    '/mybubbles/:_id/event': {
      //to: 'bubbleEventPage',
      to: 'bubbleEventPageBackbone',
      and: function(id) { Session.set('currentBubbleId', id); }
    },
    '/mybubbles/:_id/discussion': {
      //to: 'bubbleDiscussionPage',
      to: 'bubbleDiscussionPageBackbone',
      and: function(id) { Session.set('currentBubbleId', id); }
    },
    '/mybubbles/:_id/file': {
      //to: 'bubbleFilePage',
      to: 'bubbleFilePageBackbone',
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
      to: 'bubbleMembersPageBackbone',
      and: function(id) { Session.set('currentBubbleId', id); }
    },


  // Posts Related Routes
    '/mybubbles/:_bId/posts/:_pId': {
      //to: 'postPage',
      to: 'postPageBackbone',
      and: function(bId, pId) { Session.set('currentBubbleId', bId); Session.set('currentPostId', pId); Meteor.subscribe('singlePost', pId);}
    },
    '/mybubbles/:_bId/posts/:_pId/edit/discussion': {
      to: 'discussionEdit',
      and: function(bId, pId) { Session.set('currentBubbleId', bId); Session.set('currentPostId', pId); Meteor.subscribe('singlePost', pId);}
    },
    '/mybubbles/:_bId/posts/:_pId/edit/event': {
      to: 'eventEdit',
      and: function(bId, pId) { Session.set('currentBubbleId', bId); Session.set('currentPostId', pId); Meteor.subscribe('singlePost', pId);}
    },
    '/mybubbles/:_bId/posts/:_pId/edit/file': {
      to: 'fileobjectEdit',
      and: function(bId, pId) { Session.set('currentBubbleId', bId); Session.set('currentPostId', pId); Meteor.subscribe('singlePost', pId);}
    },
    '/mybubbles/:_bId/posts/:_pId/updated': {
      to: 'postPage',
      and: function(bId, pId) { Session.set('currentBubbleId', bId); Session.set('currentPostId', pId); Meteor.subscribe('singlePost', pId);}
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
    '/mybubbles/create': 'bubbleSubmit',

    '/settings/invites': 'invitationsPage',

    '/settings/about': 'about',


  // User Profile Related Routes
    '/settings/userprofile/:id': {
      to: 'userProfile',
      and: function(id) { Session.set('selectedUserId',id); }
    },

    '/edit_profile/:id': {
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
    '/explore/': function() {
      // TODO: Loading flag
      var data = new SidebarData.Sidebar();
      data.getFirstExploreId(function(exploreId) {
        if (exploreId) {
          Meteor.Router.to('explorePageBackbone', exploreId);
        } else {
          Meteor.Router.to('exploreSubmit');
        }
      });
    },
    '/explore/:id/home': {
      to: 'explorePageBackbone',
      and: function(id) {
        Session.set('currentExploreId', id);
      }
    },
    '/explore/:_expId/posts/:_pId': {
      to: 'explorePostPageBB',
      and: function(expId, pId){
        Session.set('currentExploreId', expId);
        Session.set('currentPostId', pId);
        Meteor.subscribe('comments', pId);
        //Meteor.subscribe('currentExplore', expId);
        Meteor.subscribe('singlePost', pId);
      }
    },
    '/explore/:_expId/posts/:_pId/updated': {
      to: 'explorePostPage',
      and: function(expId, pId){
        Session.set('currentExploreId', expId);
        Session.set('currentPostId', pId);
        Meteor.subscribe('comments', pId);
        //Meteor.subscribe('currentExplore', expId);
        Meteor.subscribe('singlePost', pId);
      }
    },
    /*
    '/explore': {
      to: 'exploreAll',
      and: function(){
        var user = Meteor.users.findOne({_id: Meteor.userId()});
        Session.set('selectedUsername', user.username);
      }
    },*/


  // Flags Related Routes
    '/all-flags': 'flagsList',


  // Analytics Related Routes
    '/analytics': 'userlog',

  // UserLevel 4's "Create User" page
    '/createUser': 'createUser',

  // Dashboard
    '/dashboard': 'dashboard',


  // Etc Routes
    //Capturing rogue urls, hopefully this will be a 404 page in the future
    '/': {
      to: '/',
      and: function(){
        query = this.querystring.split('=');
        if(query.length >0 && query[0] == 'deviceToken'){
          if(Meteor.user()){
            Meteor.users.update(Meteor.userId(), {$set: {deviceToken :query[1]}},  function(error) {
              if (error) {
                // display the error to the user
                throwError(error.reason);
              }
            });
          }else{
            Session.set('deviceToken', query[1]);
          }
        }
      }
    },
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
  'logCurrentPage': function(page) {
    if(Meteor.userId()){
      //Clears timeout that prevents simultanous logging of user's action
      Meteor.clearTimeout(mto);
      mto = Meteor.setTimeout(function() {
        //Creation of userlog object
        var userlog = {
          action: 'view'
        }
        //Logs the page that the user has switched to
        Meteor.call('createLog', userlog, window.location.pathname, function(error) {
          if(error) {
            throwError(error.reason);
          }
        });
      }, 500);
      return page;
    }else if(Meteor.loggingIn()) {
      return 'loading';
    }else {
      return 'welcomePage';
    }
  },
  'belongToBubble': function(page) {
    console.log("belongToBubble Start");
    if(window.location.pathname.match('mybubbles')) {
      
      var xhr_isAdmin = $.ajax({
        url: "/2013-09-11/isadmin?bubbleid="+Session.get('currentBubbleId')+"&userid="+Meteor.userId(),
        async: false
      });
      var xhr_isMember = $.ajax({
        url: "/2013-09-11/ismember?bubbleid="+Session.get('currentBubbleId')+"&userid="+Meteor.userId(),
        async: false
      });

      console.log("AJAX Responses: ", xhr_isMember, xhr_isAdmin);
      
      if(xhr_isMember.responseText == "False"
        && xhr_isAdmin.responseText == "False"
        && '3' != Meteor.user().userType)
      {
        console.log("RETRUN BUBBLE PUBLIC PAGE");
        Meteor.Router.to('bubblePublicPage',Session.get('currentBubbleId'));
        return 'bubblePublicPage';
      }
      /*
      if(Meteor.user() && '3' != Meteor.user().userType){
        var bubble = Bubbles.findOne(Session.get('currentBubbleId'));
        console.log("Bubble: ", bubble);
        if(bubble) {
          if(!_.contains(bubble.users.admins, Meteor.userId()) && !_.contains(bubble.users.members, Meteor.userId())) {
            return 'bubblePublicPage';
          }
        }
      }
      */
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
        Meteor.Router.to('bubblePageBackbone', Session.get('currentBubbleId'));
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
  'level4Permissions': function(page){
    if(Meteor.user() && '4' == Meteor.user().userType) {
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
// Meteor.Router.filter('belongToBubble', {except: ['bubblePublicPage','searchAll', 'searchUsers', 'searchBubbles', 'searchDiscussions', 'searchEvents',  'searchFiles', 'bubbleSubmit']});
Meteor.Router.filter('belongToBubble', {only: ['bubblePageBackbone','bubblePage','bubbleMembersPageBackbone','bubbleEventPageBackbone','bubbleDiscussionPageBackbone','bubbleFilePageBackbone']});
//Add Lvl 3 pages here
Meteor.Router.filter('level3Permissions', {only: ['flagsList', 'userlog']});
Meteor.Router.filter('level4Permissions', {only: ['createUser']});
Meteor.Router.filter('clearErrors');
Meteor.Router.filter('logCurrentPage', {except: ['secretLogin', 'loggedOut', 'siteAccessDenied', 'loginPage', 'welcomePage', 'browserCheck', 'browserUnsupported', '404NotFound']});
Meteor.Router.filter('browserSupported', {except: ['browserUnsupported']});
//Ensures that user is routed to either the mybubbles page or search bubbles page
Meteor.Router.filter('routeWhenLogin', {only: ['/']});
//Ensures that user is not allowed to edit or create a post if bubble type is super and user type is not superuser
Meteor.Router.filter('hasSuperBubblePermissions', {only: ['discussionSubmit', 'eventSubmit', 'fileSubmit', 'discussionEdit', 'eventEdit', 'fileobjectEdit']})
//Checks if page has a potential increase in view count
Meteor.Router.filter('increaseViewCount', {only: ['postPage', 'discussionEdit', 'eventEdit', 'fileobjectEdit']});
Meteor.Router.filter('setNumUpdatesTo3', {only: ['dashboard','bubblePage']});