Template.eventSubmit.events({
  'submit form': function(event) {
    event.preventDefault();
     
    Meteor.call('validateAndPost', {
      startTime: $(event.target).find('[name=startTime]').val(),
      location: $(event.target).find('[name=location]').val(),
      name: $(event.target).find('[name=name]').val(),
      body: $(event.target).find('[name=body]').val(),
      postType: 'event'
    });
  }
});