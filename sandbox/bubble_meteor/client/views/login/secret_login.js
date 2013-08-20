Template.secretLogin.rendered = function(){
  url_params = window.location.pathname.split("/");
  var username = url_params[2];
  var secret = url_params[3];
  console.log('Secret login: ', username, secret);
  Meteor.loginWithPassword(username, secret, function(err){
    if(err){
    }
    else{
      Meteor.Router.to('/dashboard');
    }
  });
}
