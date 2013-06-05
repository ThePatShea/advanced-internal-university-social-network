Template.postSubmit.events({
  'submit form': function(event) {
    event.preventDefault();
    var url = $(event.target).find('[name=url]').val();
    if (url.length>7 && url.slice(0,7) != "http://"){
      url = "http://" + url;
    }

    
    var post = {
      url: url,
      title: $(event.target).find('[name=title]').val(),
      message: $(event.target).find('[name=message]').val()
    }
    
    Meteor.call('post', post, function(error, id) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
        
        // if the error is that the post already exists, take us there
        if (error.error === 302)
          Meteor.Router.to('postPage', error.details)
      } else {
        Meteor.Router.to('postPage', id);
      }
    });
  }
});

Template.postSubmit.helpers({
  currentPostType: function() {
    return Session.get('currentPostType');
  },

  activePostTypeClass: function() {
    var currentPostType  =  Session.get('currentPostType');
    var buttonPostType   =  arguments[0];
    var active;

    if (buttonPostType === currentPostType)
      active = true
    else
      active = false

    return active && 'active';
  }
});
