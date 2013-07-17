Template.logoutDropdown.helpers({
  getUsername: function(){
    return Meteor.user().username;
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
  'click .view-profile': function() {
    Meteor.Router.to('userProfile',Meteor.userId());
  }
});