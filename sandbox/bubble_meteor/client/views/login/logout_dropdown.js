Template.logoutDropdown.helpers({
  getUsername: function(){
    return Meteor.user().name;
  }
});

Template.logoutDropdown.events({
  'click .signout': function() {
    if (confirm("Leave Emory Bubble?")) {
      Meteor.logout(function(){
        Meteor.Router.to('loginPage');
      })
    }
  },
  'click .support': function() {
    window.open('http://support.emorybubble.com','_blank');
  },
  'click .view-profile': function() {
    Meteor.Router.to('userProfile',Meteor.userId());
  },
});
