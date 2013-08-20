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
          console.log('Password reset.');
        }
      });
      Meteor.Router.to('/dashboard');
    }
  });
}
