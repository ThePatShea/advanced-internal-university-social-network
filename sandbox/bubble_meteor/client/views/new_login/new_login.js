Template.newLogin.rendered = function(){
};

Template.newLogin.destroyed = function() {
  Session.set('vToken',undefined);
};

Template.newLogin.events({
  'submit form': function(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var email = $('#email').val();
    var password = $('#password').val();
    var vToken = Session.get('vToken');

    checkVerification(email, function(err,res) {
      if(!err) {
        login(email,password);
      } else {
        if(vToken) {
          verifyEmail(email,vToken, function(err,res) {
            if(!err) {
              login(email,password);
            } else {
              alert("ERROR: " + err);
            }
          });
        } else {
          alert("ERROR: " + err);
        }
      }
    })
  }
});

verifyEmail = function(email,vToken,callback) {
  $.ajax({
    type: "POST",
    url: "/newLogin/verifyEmail/",
    data: {vToken: vToken, email: email}
  })
  .done(function(msg) {
    if(typeof callback === 'function')
      callback(undefined,msg)
  })
  .fail(function(msg) {
    if(typeof callback === 'function')
      callback(msg.responseText,undefined);
  });
};

checkVerification = function(email, callback) {
  $.ajax({
      type: "GET",
      url: "/newLogin/checkVerified/" + email
    })
    .done(function(msg) {
      if(typeof callback === 'function')
        callback(undefined,msg);
    })
    .fail(function(msg) {
      if(typeof callback === 'function')
        callback(msg.responseText,undefined);
    });
};

login = function(username,password) {
  Meteor.loginWithPassword(username,password,function(err) {
    if(!err) {
      if(Session.get('vToken'))
        Meteor.Router.to('onboarding');
      else
        Meteor.Router.to('dashboard');
    } else {
      alert("ERROR: " + err);
    }
  });
}