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
      var tempcanvas = document.createElement('canvas');
      var retinacanvas = document.createElement('canvas');
      tempcanvas.width = 160;
      tempcanvas.height = 160;
      retinacanvas.width = 320;
      retinacanvas.height = 320;
      var tempcontext = tempcanvas.getContext('2d');
      var retinacontext = retinacanvas.getContext('2d');
      $('#tempprofile').show();
      $('#tempprofile').hide();
      console.log($("#tempprofile")[0]);
      tempcontext.drawImage($('#tempprofile')[0], 0, 0, 160, 160);
      retinacontext.drawImage($('#tempprofile')[0], 0, 0, 320, 320);
      var profilePictureData = tempcanvas.toDataURL();
      var retinaProfilePictureData = retinacanvas.toDataURL();
      $('#profilePicture').hide();
      $('#retinaProfilePicture').hide()
      $('#profilePicture').attr('src', profilePictureData);
      $('#retinaProfilePicture').attr('src', retinaProfilePictureData);
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
            var profileProperties = {
              profilePicture: profilePictureData,
              retinaProfilePicture: retinaProfilePictureData,
            };
            //console.log(profilePictureData);
            //console.log($('#profilePicture').attr('src'));

            if(Session.get('deviceToken'))
              Meteor.users.update(Meteor.userId(), {$set: {deviceToken:Session.get('deviceToken')}});

            var userid = Meteor.userId();
            Meteor.users.update(userid, {$set: profileProperties}, function(err){
              if(err){
                console.log(err);
              }
            });
            Meteor.Router.to('dashboard');
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
            if(Session.get('deviceToken'))
              Meteor.users.update(Meteor.userId(), {$set: {deviceToken:Session.get('deviceToken')}});

            var bubbles = Bubbles.find({$or: [{'users.members': Meteor.userId()}, {'users.admins': Meteor.userId()}]}).fetch();

            Meteor.Router.to('dashboard');
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
  },

  'change #username': function(event){
    //console.log(event.target.value);
    var username = event.target.value;
    var usernameLetter = username[0].toLowerCase();
    var image_tag = '<img src="/img/letterprofiles/' + usernameLetter + '.jpg" id="tempprofile">';
    //console.log(image_tag);
    $('form').append(image_tag);
    $('#tempprofile').hide();
  }
});

Template.loginPage.rendered = function(){
  // if(Session.get('signup') != 'block'){
  //   Session.set('signup', 'block');
  // }else{
  //   Session.set('signup', 'none');
  // }
  $('#tempprofile').hide();
  $('#profilePicture').hide();
  $('#retinaProfilePicture').hide();

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
    }, 1000);
  }
}
