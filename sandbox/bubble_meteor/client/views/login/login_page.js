Template.loginPage.helpers({
  isSignup: function() {
    if(Session.get('signup')){
      return Session.get('signup'); 
    }else{
      return 'none';
    }
  },
  getSignupText: function() {
    if(Session.get('signup') != 'block'){
      return 'Create Account';
    }else{
      return 'Cancel';
    }
  },
  getSubmitText: function() {
    if(Session.get('signup') != 'block'){
      return 'Log In';
    }else{
      return 'Sign Up';
    }
  }
});

Template.loginPage.events({
  'submit form': function(event) {
    event.preventDefault();
    //Google Analytics
    // _gaq.push(['_trackEvent', 'Post', 'Create Discussion', $(event.target).find('[name=name]').val()]);
    if(Session.get('signup') == 'block'){
      var username = $(event.target).find('[name=username]').val();
      var password = $(event.target).find('[name=password]').val();
      var email = $(event.target).find('[name=email]').val();
      if(username && password && email ){
        Accounts.createUser({
          username: username,
          email: email,
          password: password
        });
        Meteor.loginWithPassword(username, password, function(err) {
          if(err){
            //Do something with error
          }else{
            Meteor.Router.to('searchBubbles');
          }
        });
      }else{
        alert("Enter valid credentials");
      }
    }else{
      var username = $(event.target).find('[name=username]').val()
      var password = $(event.target).find('[name=password]').val()

      if(username && password){
        Meteor.loginWithPassword(username, password, function(err) {
          if(err){
            //Do something with error
          }else{
            var bubbles = Bubbles.find({$or: [{'users.members': Meteor.userId()}, {'users.admins': Meteor.userId()}]}).fetch();
            if(bubbles.length > 0) {
              Meteor.Router.to('bubblePage',bubbles[0]._id);
            }else{
              Meteor.Router.to('searchBubbles');
            }
          }
        });   
      }else{
        alert("Enter valid credentials");
      }
        
    }
  },

  'click .signup': function(event) {
    event.preventDefault();
    if(Session.get('signup') != 'block'){
      Session.set('signup', 'block');
    }else{
      Session.set('signup', 'none');
    }
  }
});

Template.loginPage.rendered = function(){
  // if(Session.get('signup') != 'block'){
  //   Session.set('signup', 'block');
  // }else{
  //   Session.set('signup', 'none');
  // }
  if(Session.get('secret') && Session.get('secret') != null){
    var secret = Session.get('secret');
    setTimeout(function(){
      var authenticatedUser = Meteor.users.findOne({'secret': secret});
      var authenticatedUsername = authenticatedUser.username;
      //console.log(secret, authenticatedUsername);
      Meteor.loginWithPassword(authenticatedUsername, secret, function(err){
        if(err){
          //Error
          console.log(err);
        }
        else{
          Session.set('secret', null);
          Meteor.Router.to('searchBubbles');
        }
      });
    }, 100);
  }
}