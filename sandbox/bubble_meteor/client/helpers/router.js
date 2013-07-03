Meteor.Router.add({
  //Login from authentication system
  '/login': 'loginPage',

  //Post Routes
  '/mybubbles/:_bId/posts/:_pId': {
    to: 'postPage', 
    and: function(bId, pId) { Session.set('currentPostId', pId); }
  },
  '/posts/:_id/edit/discussion': {
    to: 'discussionEdit', 
    and: function(id) { Session.set('currentPostId', id); }    
  },
  '/posts/:_id/edit/event': {
    to: 'eventEdit', 
    and: function(id) { Session.set('currentPostId', id); }    
  },
  '/posts/:_id/edit/file': {
    to: 'fileobjectEdit', 
    and: function(id) { Session.set('currentPostId', id); }    
  },

  //Bubble Routes
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
  '/mybubbles/:_id/edit': 'bubbleEdit',
  '/mybubbles/:_id/members': 'bubbleMembersPage',
  
  //Submit Routes
  '/mybubbles/:_id/create/discussion': 'discussionSubmit',
  '/mybubbles/:_id/create/event': 'eventSubmit', 
  '/mybubbles/:_id/create/file': 'fileSubmit',
  '/mybubbles/create/bubble': 'bubbleSubmit',

  //Routes for User
  '/userprofile/:id': {
    to: 'userProfile',
    and: function(id) { Session.set('selectedUserId',id); }
  },

  '/editprofile/:id': {
    to: 'userprofileEdit',
    and: function(id) { Session.set('selectedUserId',id)}
  },

  //Routes for Search
  '/mybubbles/search/all': 'searchAll',
  '/mybubbles/search/users': 'searchUsers',
  '/mybubbles/search/bubbles': 'searchBubbles',
  '/mybubbles/search/discussions': 'searchDiscussions',
  '/mybubbles/search/events': 'searchEvents',
  '/mybubbles/search/files': 'searchFiles',

  //Capturing rogue urls, hopefully this will be a 404 page in the future
  '*': '404NotFound'
});

Meteor.Router.filters({
  'checkRoutes': function(page) {
    if(Meteor.user()){
      var bubble = Bubbles.findOne(Session.get('currentBubbleId'));
      if(bubble) {
        if(!_.contains(bubble.users.admins, Meteor.userId()) && !_.contains(bubble.users.members, Meteor.userId())) {
          return 'bubblePublicPage';
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
  }
});

Meteor.Router.filter('checkRoutes', {except: ['searchAll', 'searchBubbles', 'searchFiles', 'searchEvents', 'searchDiscussions', 'searchUsers'] });
Meteor.Router.filter('clearErrors');
Meteor.Router.filter('checkLoginStatus');
