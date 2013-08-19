Template.onboarding.helpers({
  getCurrentName: function() {
    return Meteor.user().username;
  },
});


Template.onboarding.events({
  'click #accept-terms': function() {
    $('#cb-form-container-onboarding .cb-submit').removeClass('ready-false');
    $('#cb-form-container-onboarding .cb-submit').prop('disabled', false);
    $('#accept-terms').addClass('selected');
  },
  'submit form': function(e) {
    e.preventDefault();

    var currentProfileId = Meteor.userId();

    var profileProperties = {
      profilePicture: $(e.target).find('[id=userprofilepicture_preview]').attr('src'),
      retinaProfilePicture: $(e.target).find('[id=userprofilepicture_retina]').attr('src'),
      lastUpdated: new Date().getTime(),
    };

    Meteor.users.update(currentProfileId, {$set: profileProperties}, function(error) {
      if (error) {
        throwError(error.reason);
      } else {
        Meteor.Router.to('dashboard');
      }
    });

  },
});













Template.onboarding.rendered = function() {
  $('#cb-form-container-onboarding .cb-submit').addClass('ready-false');
  $('#cb-form-container-onboarding .cb-submit').prop('disabled', true);
}







