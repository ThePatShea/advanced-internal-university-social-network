Template.bubbleSubmit.events({
  'submit form': function(event) {
    event.preventDefault();

    var post = {
      title: $(event.target).find('[name=title]').val(),
      description: $(event.target).find('[name=description]').val()
    }
    
    Meteor.call('bubble', bubble, function(error, id) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
        
        // if the error is that the post already exists, take us there
        if (error.error === 302)
          Meteor.Router.to('bubblePage', error.details)
      } else {
        Meteor.Router.to('bubblePage', id);
      }
    });
  }
});