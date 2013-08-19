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
});


Template.onboarding.rendered = function() {
  $('#cb-form-container-onboarding .cb-submit').addClass('ready-false');
  $('#cb-form-container-onboarding .cb-submit').prop('disabled', true);
}
