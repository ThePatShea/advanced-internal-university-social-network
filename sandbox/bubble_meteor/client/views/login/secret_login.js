Template.secretLogin.rendered = function(){
  url_params = window.location.pathname.split("/");
  var username = url_params[2];
  var secret = url_params[3];
  console.log('Secret login: ', username, secret);
  Meteor.loginWithPassword(username, secret, function(err){
    if(err){
    }
    else{
      var theUrl = '/resetpass/' + username;
      $.ajax({url: theUrl, success:function(result){
          console.log('Password reset');
        }
      });

      var user = Meteor.users.findOne({'username': username});
      if(typeof user.neverLoggedIn != 'undefined'){
        if(user.neverLoggedIn == true){
          console.log('User has never logged in before.');
          //Meteor.Router.to('/onboarding');
          Meteor.Router.to('/dashboard');
        }
        else{
          console.log('Seen this user before.');
          Meteor.Router.to('/dashboard');
        }
      }
      else{
        console.log('Neverlogged in not defined ... User has never logged in before.');
        Meteor.Router.to('/dashboard');
      }
    }
  });
}
