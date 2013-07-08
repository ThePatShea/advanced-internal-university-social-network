Meteor.Router.add({
  //Login from authentication system
  '/login': 'loginPage',

  /***************  Bubbles Related Routes   ***************/
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
  /***************  Bubbles Related Routes (End)   ***************/

  /***************  Posts Related Routes   ***************/
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
  '/posts/:_id/edit/file': {
    to: 'fileobjectEdit',
    and: function(id) { Session.set('currentPostId', id);}
  },
  /***************  Posts Related Routes (End)   ***************/

  /***************  Creation Related Routes   ***************/
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
  /***************  Creation Related Routes (End)   ***************/

  /***************  User Profile Related Routes   ***************/
  '/userprofile/:id': {
    to: 'userProfile',
    and: function(id) { Session.set('selectedUserId',id); }
  },

  '/editprofile/:id': {
    to: 'userprofileEdit',
    and: function(id) { Session.set('selectedUserId',id)}
  },
  /***************  User Profile Related Routes (End)   ***************/

  /***************  Search Related Routes   ***************/
  '/mybubbles/search/all': 'searchAll',
  '/mybubbles/search/users': 'searchUsers',
  '/mybubbles/search/bubbles': 'searchBubbles',
  '/mybubbles/search/discussions': 'searchDiscussions',
  '/mybubbles/search/events': 'searchEvents',
  '/mybubbles/search/files': 'searchFiles',
  /***************  Search Related Routes (End)   ***************/

  /***************  Flags Related Routes   ***************/
  '/flags/all': 'flagsList',
  /***************  Flags Related Routes (End)   ***************/

  /***************  Etc Routes   ***************/
  //Capturing rogue urls, hopefully this will be a 404 page in the future
  '/': '/',
  '*': '404NotFound'
  /***************  Etc Routes (End)   ***************/
});

Meteor.Router.filters({
  'belongToBubble': function(page) {
    if(Meteor.user()){
      if(Meteor.user().userType != 'superuser'){
        var bubble = Bubbles.findOne(Session.get('currentBubbleId'));
        if(bubble) {
          if(!_.contains(bubble.users.admins, Meteor.userId()) && !_.contains(bubble.users.members, Meteor.userId())) {
            return 'bubblePublicPage';
          }
        }
      }
      return page;
    }
  },
  'clearErrors': function(page) {
    clearErrors();
    return page;
  },
  'checkLoginStatus': function(page) {
    if(Meteor.userId()){
      return page;
    }else if(Meteor.loggingIn()) {
      return 'loading';
    }else {
      return 'loginPage';
    }
  },
  'routeWhenLogin': function(page) {
    var bubbles = Bubbles.find({$or: [{'users.members': Meteor.userId()}, {'users.admins': Meteor.userId()}]}).fetch();
    if(bubbles.length > 0) {
      console.log("this ran");
      Meteor.Router.to('bubblePage',bubbles[0]._id);
      return 'bubblePage';
    }else{
      return 'searchBubbles';
    }
    return page;
  },
  'hasSuperPermissions': function(page) {
    if('super' == Bubbles.findOne(Session.get('currentBubbleId')).bubbleType){
      if('superuser' == Meteor.user().userType){
        return page;
      }else{
        Meteor.Router.to('bubblePage',Session.get('currentBubbleId'));
        return 'bubblePage';
      }
    }else{
      return page;
    }
  }
});

Meteor.Router.filter('belongToBubble', {except: ['searchAll', 'searchBubbles', 'searchFiles', 'searchEvents', 'searchDiscussions', 'searchUsers', 'bubbleSubmit', 'userProfile', 'userProfileEdit', 'flagsList'] });
Meteor.Router.filter('clearErrors');
Meteor.Router.filter('checkLoginStatus');

//Ensures that user is routed to either the mybubbles page or search bubbles page
Meteor.Router.filter('routeWhenLogin', {only: ['/']});

//Ensures that user is not allowed to edit or create a post if bubble type is super and user type is not superuser 
Meteor.Router.filter('hasSuperPermissions', {only: ['discussionSubmit', 'eventSubmit', 'fileSubmit', 'discussionEdit', 'eventEdit', 'fileobjectEdit']})
