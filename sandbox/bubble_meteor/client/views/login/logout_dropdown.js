Template.logoutDropdown.helpers({
  getUsername: function(){
    //user = Meteor.users.findOne(Meteor.userId());
    var user = userObject.toJSON();
    return user.name;
  }
});

Template.logoutDropdown.events({
  'click .signout': function() {
      Meteor.call('createLog', 
        { action: 'logout' }, 
        window.location.pathname, 
        function(error) { if(error) { throwError(error.reason); }
      });

      Meteor.logout(function(){
        Meteor.Router.to('loggedOut');
      })
  },
  'click .support': function() {
    window.open('http://support.emorybubble.com','_blank');
  },
  'click .view-profile': function() {
    Meteor.Router.to('userProfile',Meteor.userId());
  },
});
