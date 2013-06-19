Template.bubbleSubmit.events({
  'submit form': function(event) {
    event.preventDefault();

    var bubble = {
      title: $(event.target).find('[name=title]').val(),
      description: $(event.target).find('[name=description]').val(),
      category: $(event.target).find('[name=category]').val()
    }
    
    Meteor.call('bubble', bubble, function(error, bubbleId) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
      } else {
        Meteor.Router.to('bubblePage', bubbleId);
      }
    });
  }
});
