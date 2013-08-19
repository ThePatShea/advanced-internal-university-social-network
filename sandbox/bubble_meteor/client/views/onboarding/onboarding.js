Template.onboarding.helpers({
  getCurrentName: function() {
    return Meteor.user().username;
  }
});
