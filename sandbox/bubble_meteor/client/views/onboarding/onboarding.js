Template.onboarding.helpers({
  getCurrentName: function() {
    //var user = Meteor.users.findOne(Meteor.userId());
    return Meteor.user().name;
  },
});


Template.onboarding.events({
  'click #accept-terms': function() {
    $('.cb-submit').removeClass('ready-false');
    $('.cb-submit').prop('disabled', false);
    $('.agree-terms').addClass('selected');

    Session.set("termsAccepted", "true");
  },

  'click .removeCropTool': function() {
          cropArea.cancelSelection();
          //$(".crop").hide();
          //$("#drop_zone").show();
  },

  'submit form': function(e) {
    e.preventDefault();

    var currentProfileId = Meteor.userId();
    var currentUser = Meteor.users.findOne(currentProfileId);

    var profileProperties = {
      lastUpdated: new Date().getTime(),
      neverLoggedIn: false
    };

    if(typeof mainURL != 'undefined'){
        if(mainURL.length != 0){
          profileProperties.profilePicture = mainURL;
          profileProperties.retinaProfilePicture = retinaURL;
        }
    }

    Meteor.users.update(currentProfileId, {$set: profileProperties}, function(error) {
      if (error) {
        throwError(error.reason);
      } else {
          if(typeof currentUser.neverOnboarded == 'undefined'){
            Meteor.users.update({_id: currentProfileId}, {$set: {neverOnboarded: false}});
            //Meteor.Router.to('onboardingWalkThrough');
            window.location.href = '/tour/index.html';
          }
          else if(currentUser.neverOnboarded == true){
            Meteor.users.update({_id: currentProfileId}, {$set: {neverOnboarded: false}});
            //Meteor.Router.to('onboardingWalkThrough');
            window.location.href = '/tour/index.html';
          }
          else{
            Meteor.Router.to('/dashboard');
          }
      }
    });

    Meteor.call("sendWelcomeEmail", Meteor.userId());
  },

  'dragover .dropzone': function(evt){
  console.log('Dragover');
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy';
  },

  'change #onboardingFilesToUpload': function(evt){
    files = evt.target.files;
    //If more than one file dropped on the dropzone then throw an error to the user.
    if(files.length > 1){
      error = new Meteor.Error(422, 'Please choose only one image as the bubble image.');
      throwError(error.reason);
    } else {
      f = files[0];
      //If the file dropped on the dropzone is an image then start processing it
      if (f.type.match('image.*')) {
        var reader = new FileReader();

        var mainCanvas = document.getElementById('main-canvas');
        var retinaCanvas = document.getElementById('retina-canvas');
        var mainContext = mainCanvas.getContext('2d');
        var retinaContext = retinaCanvas.getContext('2d');
        var profileImage = new Image();

        var minX = 67;
        var minY = 67;

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
          return function(e) {
              console.log("FILE!");
              $("#onboarding_drop_zone").hide();
              $(".crop").attr("src", e.target.result).load(function() {
              profileImage.src = e.target.result;
              cropArea = $('.crop').imgAreaSelect({instance: true, aspectRatio: '1:1', imageHeight: profileImage.height, imageWidth: profileImage.width, x1: '10', y1: '10', x2: (10+minX), y2: (10+minY), parent: ".cb-form > .attach-files", handles: true, onInit: function(img, selection) {
                mainContext.drawImage(profileImage, selection.x1, selection.y1, selection.width, selection.height, 0, 0, 160, 160);
                retinaContext.drawImage(profileImage, selection.x1, selection.y1, selection.width, selection.height, 0, 0, 320, 320);
                mainURL = mainCanvas.toDataURL();
                retinaURL = retinaCanvas.toDataURL();
                $(".profile-pic-preview").attr("src",mainURL);
                if(Session.get("DisableCrop") == "1")
                {
                  if(profileImage.width <= profileImage.height)
                  {
                    x1 = 0;
                    y1 = (profileImage.height - profileImage.width) / 2;
                    widthHeight = profileImage.width;
                  }
                  else
                  {
                    y1 = 0;
                    x1 = (profileImage.width - profileImage.height) / 2;
                    widthHeight = profileImage.height;
                  }
                  mainContext.drawImage(profileImage, x1, y1, widthHeight, widthHeight, 0, 0, 160, 160);
                  retinaContext.drawImage(profileImage, x1, y1, widthHeight, widthHeight, 0, 0, 320, 320);
                  mainURL = mainCanvas.toDataURL();
                  retinaURL = retinaCanvas.toDataURL();
                  cropArea.cancelSelection();
                }
              }, onSelectChange: function(img, selection) {
                if(selection.width != 0)
                {
                  mainContext.drawImage(profileImage, selection.x1, selection.y1, selection.width, selection.height, 0, 0, 160, 160);
                  console.log(selection.y1);
                  retinaContext.drawImage(profileImage, selection.x1, selection.y1, selection.width, selection.height, 0, 0, 320, 320);
                  mainURL = mainCanvas.toDataURL();
                  retinaURL = retinaCanvas.toDataURL();
                  $(".profile-pic-preview").attr("src",mainURL);
                }
                else
                {
                  cropArea.setSelection(10,10, (10+minX),(10+minY));
                  cropArea.setOptions({show: true});
                  cropArea.update();
                }
                //console.log(selection.x1+" "+selection.y1+" "+selection.width+" "+selection.height);
              }, onSelectEnd: function(img, selection){
                if((selection.width < minX) || (selection.height < minY))
                {
                  if((selection.x1 > profileImage.width-minX) || (selection.y1 > profileImage.height-minY))
                  {
                    if(selection.x1 < minX)
                    {
                      cropArea.setSelection(0,selection.y2-minY,minX,selection.y2);
                      cropArea.update();
                    }
                    else if(selection.y1 < minY)
                    {
                      cropArea.setSelection(selection.x2-minX,0,selection.x2,minY);
                      cropArea.update();
                    }
                    else
                    {
                      cropArea.setSelection(selection.x2-minX,selection.y2-minY,selection.x2,selection.y2);
                      cropArea.update();
                    }

                  }
                  else
                  {
                    cropArea.setSelection(selection.x1,selection.y1,selection.x1+minX,selection.y1+minY);
                    cropArea.update();
                  }
                }
              }});
            });
          };
        })(f);
        reader.readAsDataURL(f);
      }
    }
  }
});


Template.onboarding.rendered = function() {
  //uid = Meteor.userId();
  //user = Meteor.users.findOne({_id: uid});

  if(!userObject){
    userObject = new UserData.UserInfo({id: Meteor.userId()});
    userObject.fetch({async: false});
  }

  userObject.clear();
  userObject.id = uId;
  userObject.fetch({async: false});

  var newUser = userObject.toJSON();
  if(typeof newUser.neverOnboarded == 'undefined'){
    if(typeof newUser.neverLoggedIn == 'undefined'){
      //console.log('neverOnboarded, neverLoggedIn: ', newUser.neverOnboarded, newUser.neverLoggedIn);
      $("#cb-form-container-onboarding").show();
      $(".onboarding-wrapper-outer").show();
      $('.cb-form-onboarding').show();
      var termsAccepted = Session.get("termsAccepted");
      if (termsAccepted != "true") {
        $('#cb-form-container-onboarding .cb-submit').addClass('ready-false');
        $('#cb-form-container-onboarding .cb-submit').prop('disabled', true);
      } else {
        $('#accept-terms').addClass('selected');
      }
    }
    else if(newUser.neverLoggedIn == true){
      //console.log('neverOnboarded, neverLoggedIn: ', newUser.neverOnboarded, newUser.neverLoggedIn);
      $("#cb-form-container-onboarding").show();
      $(".onboarding-wrapper-outer").show();
      $('.cb-form-onboarding').show();
      var termsAccepted = Session.get("termsAccepted");
      if (termsAccepted != "true") {
        $('#cb-form-container-onboarding .cb-submit').addClass('ready-false');
        $('#cb-form-container-onboarding .cb-submit').prop('disabled', true);
      } else {
        $('#accept-terms').addClass('selected');
      } 
    }
    else{
      console.log('neverOnboarded, neverLoggedIn: ', newUser.neverOnboarded, newUser.neverLoggedIn);
      Meteor.users.update({_id: uId}, {$set: {neverOnboarded: false}}, function(){
        window.location.href = '/tour/index.html';
      });
      
    }
  }
  else if(newUser.neverOnboarded == true){
    if(typeof newUser.neverLoggedIn == 'undefined'){
      //console.log('neverOnboarded, neverLoggedIn: ', newUser.neverOnboarded, newUser.neverLoggedIn);
      $("#cb-form-container-onboarding").show();
      $(".onboarding-wrapper-outer").show();
      $('.cb-form-onboarding').show();
      var termsAccepted = Session.get("termsAccepted");
      if (termsAccepted != "true") {
        $('#cb-form-container-onboarding .cb-submit').addClass('ready-false');
        $('#cb-form-container-onboarding .cb-submit').prop('disabled', true);
      } else {
        $('#accept-terms').addClass('selected');
      }
    }
    else if(newUser.neverLoggedIn == true){
      //console.log('neverOnboarded, neverLoggedIn: ', newUser.neverOnboarded, newUser.neverLoggedIn);
      $("#cb-form-container-onboarding").show();
      $(".onboarding-wrapper-outer").show();
      $('.cb-form-onboarding').show();
      var termsAccepted = Session.get("termsAccepted");
      if (termsAccepted != "true") {
        $('#cb-form-container-onboarding .cb-submit').addClass('ready-false');
        $('#cb-form-container-onboarding .cb-submit').prop('disabled', true);
      } else {
        $('#accept-terms').addClass('selected');
      } 
    }
    else{
      console.log('neverOnboarded, neverLoggedIn: ', newUser.neverOnboarded, newUser.neverLoggedIn);
      Meteor.users.update({_id: uId}, {$set: {neverOnboarded: false}}, function(){
        window.location.href = '/tour/index.html';
      });
      
    }
  }
  else{
    console.log('neverOnboarded, neverLoggedIn: ', newUser.neverOnboarded, newUser.neverLoggedIn);
    Meteor.Router.to('/dashboard');
  }

  /*Meteor.subscribe('singleUser', Meteor.userId(), function(){
    var user = Meteor.users.findOne({_id: Meteor.userId()});
    console.log("User: ",user);

    mainURL = '/img/letterprofiles/'+user.username.substring(0,1).toLowerCase()+'.jpg';
    retinaURL = '/img/letterprofiles/'+user.username.substring(0,1).toLowerCase()+'.jpg';
    $("#cb-form-container-onboarding").hide();*/

    /*if (typeof user.neverLoggedIn != "undefined") {
      var userEmails    =  user.emails;
      var isHealthcare  =  false;

      /*_.each(userEmails, function(email) {
        if(typeof email.address != 'undefined'){
          if (email.address.indexOf("@") != -1) {
            var healthCareCheck = email.address.split("@");

            if (healthCareCheck[1] === "emoryhealthcare.org") { 
              isHealthcare = true;
            }

          }
        }
      });*/
      
      /*console.log("User: ",user);
      if (isHealthcare == false) {
        if (user.neverLoggedIn == false) {
          console.log("User.neverOnboarded: ", user.neverOnboarded);
          if(user.neverOnboarded == false){
            Meteor.Router.to("/dashboard");
          }
          else{
            //Meteor.Router.to('onboardingWalkThrough');
            window.location.href = '/tour/index.html';
          }
        } else {
          $("#cb-form-container-onboarding").show();
          $(".onboarding-wrapper-outer").show();
          $('.cb-form-onboarding').show();
        }
      } else {
        Meteor.logout(function(){
          Meteor.Router.to("siteAccessDenied");
        });
      }
      var userlog = {
        hasLoggedIn: true
      }
      //Logs user logging in
      Meteor.call('createLog', 
        { hasLoggedIn: true }, 
        window.location.pathname, 
        function(error) { if(error) { throwError(error.reason); }
      });
    }*/



    /*var newUser = userObject.toJSON();

    if (typeof newUser.neverLoggedIn != "undefined") {
      var userEmails    =  newUser.emails;
      var isHealthcare  =  false;

      _.each(userEmails, function(email) {
        if(typeof email.address != 'undefined'){
          if (email.address.indexOf("@") != -1) {
            var healthCareCheck = email.address.split("@");

            if (healthCareCheck[1] === "emoryhealthcare.org") { 
              isHealthcare = true;
            }

          }
        }
      });
      
      console.log("User: ",newUser);
      if (isHealthcare == false) {
        if (newUser.neverLoggedIn == false) {
          console.log("User.neverOnboarded: ", newUser.neverOnboarded);
          if(typeof newUser.neverOnboarded == 'undefined'){
            Meteor.user.update({_id: Meteor.userId()}, {$set: {neverOnboarded: false}});
            Meteor.Router.to("/tour/index.html");
          }
          if(newUser.neverOnboarded == false){
            Meteor.Router.to("/dashboard");
          }
          else{
            //Meteor.Router.to('onboardingWalkThrough');
            window.location.href = '/tour/index.html';
          }
        } else {
          $("#cb-form-container-onboarding").show();
          $(".onboarding-wrapper-outer").show();
          $('.cb-form-onboarding').show();
        }
      } else {
        Meteor.logout(function(){
          Meteor.Router.to("siteAccessDenied");
        });
      }
      var userlog = {
        hasLoggedIn: true
      }
      //Logs user logging in
      Meteor.call('createLog', 
        { hasLoggedIn: true }, 
        window.location.pathname, 
        function(error) { if(error) { throwError(error.reason); }
      });
    }

    var termsAccepted = Session.get("termsAccepted");

    if (termsAccepted != "true") {
      $('#cb-form-container-onboarding .cb-submit').addClass('ready-false');
      $('#cb-form-container-onboarding .cb-submit').prop('disabled', true);
    } else {
      $('#accept-terms').addClass('selected');
    }



    Meteor.subscribe('authenticatedUser', Session.get('secret'));

    var cropArea;
    var mainURL;
    var retinaURL;

    if($(window).width() < 768)
    {
      Session.set("DisableCrop","1");
      } else {
      Session.set("DisableCrop","");
    }

    var adjustMain = function() {
      $('#main').css('height', $(window).height());
    }

    $(window).resize(function() {
      adjustMain();
    });

    adjustMain();
  });*/
}

Template.onboarding.created = function() {
  Meteor.call('createLog', 
    { action: 'login' }, 
    window.location.pathname, 
    function(error) { if(error) { throwError(error.reason); }
  });

  Meteor.subscribe('nameFromId',Meteor.userId());

  uId = Meteor.userId();

  userObject = new UserData.UserInfo({id: uId});
  userObject.fetch({async: false});
 
  // Redirects to dashboard if already had logged in before
  // Meteor.subscribe('singleUser', Meteor.userId(), function(){
  //   var testUser = Meteor.users.findOne({_id: Meteor.userId()});
  //   console.log("Callback: ", testUser);
  // });
}
