Template.loginPage.events({
  'submit form': function(event) {
    event.preventDefault();

    var username = {
      name: $(event.target).find('[name=name]').val(),
      password: $(event.target).find('[name=password]').val()
    }

    
    Meteor.Router.to('loginCallback');
  }
});