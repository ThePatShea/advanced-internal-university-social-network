Meteor.Router.add({
  //Post Routes
  '/': {to: 'newPosts', as: 'home'},
  '/best': 'bestPosts',
  '/new': 'newPosts',
  '/posts/:_id': {
    to: 'postPage', 
    and: function(id) { Session.set('currentPostId', id); }
  },
  '/posts/:_id/edit': {
    to: 'postEdit', 
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
  
  //Submit Routes
  '/submit/discussion': 'discussionSubmit',
  '/submit/document': 'documentSubmit',
  '/submit/event': 'eventSubmit',
  '/submit/file': 'fileSubmit',
  '/submit/bubble': 'bubbleSubmit'
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
