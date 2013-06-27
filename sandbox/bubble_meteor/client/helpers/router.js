Meteor.Router.add({
  //Login from authentication system
  '/login': function(){
    Meteor.Router.to('bubbleList');
  },

  //Post Routes
  '/': {
    to: 'bubblesList',
    and: function() { Session.set('currentBubbleId', undefined); }
  },

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
  '/bubbles/:_id/home': {
    to: 'bubblePage', 
    and: function(id) { Session.set('currentBubbleId', id); }
  },
  '/bubbles/:_id/event': {
    to: 'bubbleEventPage', 
    and: function(id) { Session.set('currentBubbleId', id); }
  },
  '/bubbles/:_id/discussion': {
    to: 'bubbleDiscussionPage', 
    and: function(id) { Session.set('currentBubbleId', id); }
  },
  '/bubbles/:_id/file': {
    to: 'bubbleFilePage', 
    and: function(id) { Session.set('currentBubbleId', id); }
  },
  '/bubbles/:_id/edit': {
    to: 'bubbleEdit', 
    and: function(id) { Session.set('currentBubbleId', id); }    
  },
  '/bubbles/:_id/members':{
    to: 'bubbleMembersPage',
    and: function(id) { 
      Session.set('currentBubbleId', id); 
      Session.set('selectedUsername',undefined);
    }
  },
  '/bubbles/:_id/search_result':{
  	to: 'bubbleUserSearchList',
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
  '/userprofile/:id': {
    to: 'userProfile',
    and: function(id) { Session.set('selectedUserId',id); }
  },

  '/editprofile/:id': {
    to: 'userprofileEdit',
    and: function(id) { Session.set('selectedUserId',id)}
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
  },
  'requireMembership': function(page) {
    var bubble = Bubbles.findOne(Session.get('currentBubbleId'));
    if(bubble) {
      if(_.contains(bubble.users.admins, Meteor.userId()) || _.contains(bubble.users.members, Meteor.userId())) {
        return page;
      }else{
        return 'bubblePage';
      }
    }
    return 'bubblesList';
  }
});

Meteor.Router.filter('requireMembership');
Meteor.Router.filter('requireLogin');
Meteor.Router.filter('clearErrors');
