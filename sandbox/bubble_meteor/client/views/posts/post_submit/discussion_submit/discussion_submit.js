Template.discussionSubmit.events({
  'submit form': function(event) {
    event.preventDefault();
    
    Meteor.call('validateAndPost', {
      name: $(event.target).find('[name=name]').val(),
      body: $(event.target).find('[name=body]').val(),
      postType: 'discussion'
    });
  }
});