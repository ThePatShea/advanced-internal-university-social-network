Meteor.Router.add({
  //Login from authentication system
  '/login': function(){
    Meteor.Router.to('bubbleList');
  },

  //Post Routes
  '/': {to: 'bubblesList', as: 'home'},
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
  '/bubbles': 'bubblesList',
  '/bubbles/:_id': {
    to: 'bubblePage', 
    and: function(id) { Session.set('currentBubbleId', id); }
  },
  '/bubbles/:_id/edit': {
    to: 'bubbleEdit', 
    and: function(id) { Session.set('currentBubbleId', id); }    
  },
  '/bubbles/:_id/invitation':{
    to: 'bubbleInvitation',
    and: function(id) { Session.set('currentBubbleId', id);}
  },
  
  //Submit Routes
  '/bubbles/:_id/submit/discussion':  {
    to: 'discussionSubmit', 
    and: function(id) { Session.set('currentBubbleId', id); }    
  },
  '/bubbles/:_id/submit/event': {
    to: 'eventSubmit', 
    and: function(id) { Session.set('currentBubbleId', id); }    
  },
  '/bubbles/:_id/submit/document': 'documentSubmit',
  '/bubbles/:_id/submit/file': 'fileSubmit',
  '/submit/bubble': 'bubbleSubmit',

  //Routes for User
  'userprofile/:id': {
    to: 'userProfile',
    and: function(id) { Session.set('selectedUserId',id); }
  }
});

Meteor.Router.filters({
  'requireLogin': function(page) {
    if (Meteor.user())
      return page;
    else if (Meteor.loggingIn())
      return 'loading';
    else
      return 'accessDenied';
  },
  'clearErrors': function(page) {
    clearErrors();
    return page;
  }
});

Meteor.Router.filter('requireLogin', {only: 'postSubmit'});
Meteor.Router.filter('clearErrors');
