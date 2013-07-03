Meteor.Router.add({
  //Login from authentication system
  '/login': function(){
    Meteor.Router.to('bubblesList');
  },

  //Post Routes
  '/posts/:_id': {
    to: 'postPage', 
    and: function(id) { Session.set('currentPostId', id); }
  },
  '/posts/:_id/edit/discussion': {
    to: 'discussionEdit', 
    and: function(id) { Session.set('currentPostId', id); }    
  },
  '/posts/:_id/edit/event': {
    to: 'eventEdit', 
    and: function(id) { Session.set('currentPostId', id); }    
  },

  //Bubble Routes
  '/mybubbles/:_id/home': {
    to: 'bubblePage', 
    and: function(id) { Session.set('currentBubbleId', id); Session.set('lastVisitedBubbleId', id); }
  },
  '/mybubbles/:_id/event': {
    to: 'bubbleEventPage', 
    and: function(id) { Session.set('currentBubbleId', id); Session.set('lastVisitedBubbleId', id); }
  },
  '/mybubbles/:_id/discussion': {
    to: 'bubbleDiscussionPage', 
    and: function(id) { Session.set('currentBubbleId', id); Session.set('lastVisitedBubbleId', id); }
  },
  '/mybubbles/:_id/file': {
    to: 'bubbleFilePage', 
    and: function(id) { Session.set('currentBubbleId', id); Session.set('lastVisitedBubbleId', id); }
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
  '*': {
    to: 'searchBubbles',
    and: function() { Meteor.Router.to('searchBubbles'); }
  }
});

Meteor.Router.filters({
  'checkLoginAndRoutes': function(page) {
    if(Meteor.user()){
      return page;
    }else if(Meteor.loggingIn()) {
      return 'loading';
    }else { 
      return 'accessDenied';
    }
  },
  'clearErrors': function(page) {
    clearErrors();
    return page;
  },
  'isLoggedIn': function(page) {
    var bubble = Bubbles.findOne(Session.get('currentBubbleId'));
    if(bubble) {
      if(_.contains(bubble.users.admins, Meteor.userId()) || _.contains(bubble.users.members, Meteor.userId())) {
        return page;
      }else{
        return 'bubbleCover';
      }
    }
    return page;
  }
});

Meteor.Router.filter('checkLoginAndRoutes');
Meteor.Router.filter('clearErrors');
// Meteor.Router.filter('isLoggedIn');
