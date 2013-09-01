Template.onboarding.helpers({
  getCurrentName: function() {
    return Meteor.user().name;
  },
});


Template.onboarding.events({
  'click #accept-terms': function() {
    $('#cb-form-container-onboarding .cb-submit').removeClass('ready-false');
    $('#cb-form-container-onboarding .cb-submit').prop('disabled', false);
    $('#accept-terms').addClass('selected');
  },

  'click .removeCropTool': function() {
          cropArea.cancelSelection();
          //$(".crop").hide();
          //$("#drop_zone").show();
  },

  'submit form': function(e) {
    e.preventDefault();

    var currentProfileId = Meteor.userId();

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
        Meteor.Router.to('dashboard');
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

  'change #filesToUpload': function(evt){
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
              $("#drop_zone").hide();
              $(".crop").attr("src", e.target.result).load(function() {
              profileImage.src = e.target.result;
              cropArea = $('.crop').imgAreaSelect({instance: true, aspectRatio: '1:1', imageHeight: profileImage.height, imageWidth: profileImage.width, x1: '10', y1: '10', x2: (10+minX), y2: (10+minY), parent: ".cb-form-container", handles: true, onInit: function(img, selection) {
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
 uid = Meteor.userId()
  user = Meteor.users.findOne({_id: uid});
  mainURL = '/img/letterprofiles/'+user.username.substring(0,1).toLowerCase()+'.jpg';
  retinaURL = '/img/letterprofiles/'+user.username.substring(0,1).toLowerCase()+'.jpg';
  $("#cb-form-container-onboarding").hide();

  var user = Meteor.users.findOne({_id: Meteor.userId()});
  console.log("neverLoggedIn: " , user );  //TESTING

  if (user.neverLoggedIn == false) {
    Meteor.Router.to("/dashboard");
  } else {
    $("#cb-form-container-onboarding").show();
  }



  $('#cb-form-container-onboarding .cb-submit').addClass('ready-false');
  $('#cb-form-container-onboarding .cb-submit').prop('disabled', true);

  Meteor.subscribe('authenticatedUser', Session.get('secret'));
  Meteor.subscribe('singleUser', Meteor.userId());

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
    $('#main').css('height', $(window).height()/* - $('.navbar').height()*/);
  }

  $(window).resize(function() {
    adjustMain();
  });

  adjustMain();
}

Template.onboarding.created = function() {
 


  // Redirects to dashboard if already had logged in before
    Meteor.subscribe('singleUser', Meteor.userId());
}
