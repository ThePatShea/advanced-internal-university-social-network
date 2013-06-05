Meteor.Router.add({
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
  
  '/submit/discussion': 'discussionSubmit',
  '/submit/document': 'documentSubmit',
  '/submit/event': 'eventSubmit',
  '/submit/file': 'fileSubmit'
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
