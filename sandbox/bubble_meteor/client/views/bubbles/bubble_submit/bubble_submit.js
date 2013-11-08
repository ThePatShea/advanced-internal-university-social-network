Template.bubbleSubmit.events({
  'click .bubble-create > .cb-submit-container > .cb-submit': function(event) {
    event.preventDefault();
    event.stopPropagation();
    console.log('Bubble Submit');
    if(profileMainURL)

    var bodySelector = $('.cb-form').find('[name=body]');
    var postBody = bodySelector.html();
    var rmIndex = postBody.indexOf('<span class="wysiwyg-placeholder">Type here...</span>');
    if(rmIndex != -1)
    {
      bodySelector.html(postBody.slice(0,rmIndex));
    }

    var bubble = {
      category             : $('.cb-form').find('[name=category]').val(),
      bubbleType           : $('.cb-form').find('[name=bubbleType]').val(),
      description          : $('.cb-form').find('[name=body]').html(),
      title                : $('.cb-form').find('[name=title]').val(),
      retinaProfilePicture : profileRetinaURL,
      retinaCoverPhoto     : coverRetinaURL,
      profilePicture       : profileMainURL,
      coverPhoto           : coverMainURL,
    };

    Meteor.call('bubble', bubble, function(error, bubbleId) {
      if (error) {
        throwError(error.reason);
      } else {
        console.log('Create Bubble');
        Meteor.call('addBubbleToIndex', bubbleId, bubble.title);
        //Meteor.Router.to('bubbleMembersPageBackbone', bubbleId);
        window.location.href = "/mybubbles/" + bubbleId + "/members";
      }
    });
  },

  'click .select-bubble-type > .normal': function(evt) {
    evt.preventDefault();
    $("input[name=bubbleType]").val("normal");
    selectedBubbleType = "normal";
    $(".select-bubble-type > .super").removeClass("active-true");
    $(".select-bubble-type > .normal").addClass("active-true");
  },
  'click .select-bubble-type > .super': function(evt) {
    evt.preventDefault();
    $("input[name=bubbleType]").val("super");
    $(".select-bubble-type > .normal").removeClass("active-true");
    $(".select-bubble-type > .super").addClass("active-true");
  },
  'dragover .bubble-create > .attach-cover-photo > .drop-zone': function(evt){
    console.log('cover Dragover');
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
  },

  'drop .bubble-create > .attach-cover-photo > .drop-zone': function(evt){
    console.log('cover drop');
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
  },

  'change .bubble-create > .attach-cover-photo > .drop-zone > .file-chooser-invisible': function(evt){

    evt.stopPropagation();
    evt.preventDefault();

    console.log('Dropzone cover photo change: ', evt.target.files);

    files = evt.target.files;
    //If more than one file dropped on the dropzone then throw an error to the user.
    if(files.length > 1){
      error = new Meteor.Error(422, 'Please choose only one image as the bubble image.');
      throwError(error.reason);
    }
    else{
      f = files[0];
      //If the file dropped on the dropzone is an image then start processing it
      if (f.type.match('image.*')) {
        var reader = new FileReader();

        var coverMainCanvas = document.getElementById('cover-main-canvas');
        var coverRetinaCanvas = document.getElementById('cover-retina-canvas');
        var coverMainContext = coverMainCanvas.getContext('2d');
        var coverRetinaContext = coverRetinaCanvas.getContext('2d');
        var coverImage = new Image();

        var minX = 96*2;
        var minY = 11*2;

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
          return function(e) {
            $(".bubble-create > .attach-cover-photo > .drop-zone").hide();
            $(".bubble-create > .attach-cover-photo > .drop-zone > .file-chooser-invisible").width(1);
            $(".bubble-create > .attach-cover-photo > .drop-zone > .file-chooser-invisible").height(1);
            $(".crop-cover > .crop").attr("src", e.target.result).load(function() {
              coverImage.src = e.target.result;
              coverCropArea = $('.crop-cover > .crop').imgAreaSelect({instance: true, aspectRatio: '96:11', imageHeight: coverImage.height, imageWidth: coverImage.width, x1: '10', y1: '10', x2: (10+minX), y2: (10+minY), parent: ".cb-form", handles: true,
                onInit: function(img, selection) {
                  coverMainContext.drawImage(coverImage, selection.x1, selection.y1, selection.width, selection.height, 0, 0, 960, 110);
                  coverRetinaContext.drawImage(coverImage, selection.x1, selection.y1, selection.width, selection.height, 0, 0, 1920, 220);
                  coverMainURL = coverMainCanvas.toDataURL();
                  coverRetinaURL = coverRetinaCanvas.toDataURL();
                  if(Session.get("DisableCrop") == "1")
                  {
                    if((coverImage.width/coverImage.height) <= (96/11))
                    {
                      x1 = 0;
                      y1 = 0;
                      width = coverImage.width;
                      height = coverImage.width * (11/96);
                    }
                    else
                    {
                      y1 = 0;
                      x1 = 0;
                      height = coverImage.height;
                      width = coverImage.height * (96/11);
                    }
                    coverMainContext.drawImage(coverImage, x1, y1, width, height, 0, 0, 960, 110);
                    coverRetinaContext.drawImage(coverImage, x1, y1, width, height, 0, 0, 1920, 220);
                    coverMainURL = coverMainCanvas.toDataURL();
                    coverRetinaURL = coverRetinaCanvas.toDataURL();
                    coverCropArea.cancelSelection();
                  };
                }, onSelectChange: function(img, selection) {
                  if(selection.width != 0)
                  {
                    coverMainContext.drawImage(coverImage, selection.x1, selection.y1, selection.width, selection.height, 0, 0, 960, 110);
                    console.log(selection.y1);
                    coverRetinaContext.drawImage(coverImage, selection.x1, selection.y1, selection.width, selection.height, 0, 0, 1920, 220);
                    coverMainURL = coverMainCanvas.toDataURL();
                    coverRetinaURL = coverRetinaCanvas.toDataURL();
                  }
                  else
                  {
                    coverCropArea.setSelection(10,10, (10+minX),(10+minY));
                    coverCropArea.setOptions({show: true});
                    coverCropArea.update();
                  }
                  //console.log(selection.x1+" "+selection.y1+" "+selection.width+" "+selection.height);
                }, onSelectEnd: function(img, selection){
                  if((selection.width < minX) || (selection.height < minY))
                  {
                    if((selection.x1 > coverImage.width-minX) || (selection.y1 > coverImage.height-minY))
                    {
                      if(selection.x1 < minX)
                      {
                        coverCropArea.setSelection(0,selection.y2-minY,minX,selection.y2);
                        coverCropArea.update();
                      }
                      else if(selection.y1 < minY)
                      {
                        coverCropArea.setSelection(selection.x2-minX,0,selection.x2,minY);
                        coverCropArea.update();
                      }
                      else
                      {
                        coverCropArea.setSelection(selection.x2-minX,selection.y2-minY,selection.x2,selection.y2);
                        coverCropArea.update();
                      }
                    }
                    else
                    {
                      coverCropArea.setSelection(selection.x1,selection.y1,selection.x1+minX,selection.y1+minY);
                      coverCropArea.update();
                    }
                  }
                }
              });
            });
          };
        })(f);
        reader.readAsDataURL(f);
      }
    }
  },

  'dragover .bubble-create > .attach-profile-photo > .drop-zone': function(evt){
    console.log('profile Dragover');
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
  },

  'drop .bubble-create > .attach-profile-photo > .drop-zone': function(evt){
    console.log('profile drop');
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
  },


  'change .bubble-create > .attach-profile-photo > .drop-zone > .file-chooser-invisible': function(evt){

    evt.stopPropagation();
    evt.preventDefault();

    console.log('Dropzone profile photo change: ', evt.target.files);

      files = evt.target.files;
      //If more than one file dropped on the dropzone then throw an error to the user.
      if(files.length > 1){
        error = new Meteor.Error(422, 'Please choose only one image as the bubble image.');
        throwError(error.reason);
      }
      else{
        f = files[0];
        //If the file dropped on the dropzone is an image then start processing it
        if (f.type.match('image.*')) {
            var reader = new FileReader();

            var profileMainCanvas = document.getElementById('profile-main-canvas');
            var profileRetinaCanvas = document.getElementById('profile-retina-canvas');
            var profileMainContext = profileMainCanvas.getContext('2d');
            var profileRetinaContext = profileRetinaCanvas.getContext('2d');
            var profileImage = new Image();

            var minX = 67;
            var minY = 67;

            // Closure to capture the file information.
            reader.onload = (function(theFile) {
              return function(e) {
                $(".bubble-create > .attach-profile-photo > .drop-zone").hide();
                $(".bubble-create > .attach-profile-photo > .drop-zone > .file-chooser-invisible").width(1);
                $(".bubble-create > .attach-profile-photo > .drop-zone > .file-chooser-invisible").height(1);
                $(".crop-profile > .crop").attr("src", e.target.result).load(function() {
                  profileImage.src = e.target.result;
                  profileCropArea = $('.crop-profile > .crop').imgAreaSelect({instance: true, aspectRatio: '1:1', imageHeight: profileImage.height, imageWidth: profileImage.width, x1: '10', y1: '10', x2: (10+minX), y2: (10+minY), parent: ".cb-form", handles: true,
                    onInit: function(img, selection) {
                      profileMainContext.drawImage(profileImage, selection.x1, selection.y1, selection.width, selection.height, 0, 0, 300, 300);
                      profileRetinaContext.drawImage(profileImage, selection.x1, selection.y1, selection.width, selection.height, 0, 0, 600, 600);
                      profileMainURL = profileMainCanvas.toDataURL();
                      profileRetinaURL = profileRetinaCanvas.toDataURL();
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
                        profileMainContext.drawImage(profileImage, x1, y1, widthHeight, widthHeight, 0, 0, 300, 300);
                        profileRetinaContext.drawImage(profileImage, x1, y1, widthHeight, widthHeight, 0, 0, 600, 600);
                        profileMainURL = profileMainCanvas.toDataURL();
                        profileRetinaURL = profileRetinaCanvas.toDataURL();
                        profileCropArea.cancelSelection();
                      }
                    }, onSelectChange: function(img, selection) {
                      if(selection.width != 0)
                      {
                        profileMainContext.drawImage(profileImage, selection.x1, selection.y1, selection.width, selection.height, 0, 0, 300, 300);
                        console.log(selection.y1);
                        profileRetinaContext.drawImage(profileImage, selection.x1, selection.y1, selection.width, selection.height, 0, 0, 600, 600);
                        profileMainURL = profileMainCanvas.toDataURL();
                        profileRetinaURL = profileRetinaCanvas.toDataURL();
                      }
                      else
                      {
                        profileCropArea.setSelection(10,10, (10+minX),(10+minY));
                        profileCropArea.setOptions({show: true});
                        profileCropArea.update();
                      }
                      //console.log(selection.x1+" "+selection.y1+" "+selection.width+" "+selection.height);
                    }, onSelectEnd: function(img, selection){
                      if((selection.width < minX) || (selection.height < minY))
                      {
                        if((selection.x1 > profileImage.width-minX) || (selection.y1 > profileImage.height-minY))
                        {
                          if(selection.x1 < minX)
                          {
                            profileCropArea.setSelection(0,selection.y2-minY,minX,selection.y2);
                            profileCropArea.update();
                          }
                          else if(selection.y1 < minY)
                          {
                            profileCropArea.setSelection(selection.x2-minX,0,selection.x2,minY);
                            profileCropArea.update();
                          }
                          else
                          {
                            profileCropArea.setSelection(selection.x2-minX,selection.y2-minY,selection.x2,selection.y2);
                            profileCropArea.update();
                          }
                        }
                        else
                        {
                          profileCropArea.setSelection(selection.x1,selection.y1,selection.x1+minX,selection.y1+minY);
                          profileCropArea.update();
                        }
                      }
                    }
                  });
                });
              };
            })(f);
            reader.readAsDataURL(f);
        }
      }
    
  },

  /*'change #coverfilesToUpload': function(evt){
    files = evt.target.files;
    //If more than one file dropped on the dropzone then throw an error to the user.
    if(files.length > 1){
      error = new Meteor.Error(422, 'Please choose only one image as the bubble image.');
      throwError(error.reason);
    }
    else{
      f = files[0];
      //If the file dropped on the dropzone is an image then start processing it
      if (f.type.match('image.*')) {
        var reader = new FileReader();

        var coverCanvas = document.getElementById('cover-canvas');
        var coverRetinaCanvas = document.getElementById('cover-retina-canvas');
        var coverContext = coverCanvas.getContext('2d');
        var coverRetinaContext = coverRetinaCanvas.getContext('2d');
        var coverImage = new Image();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
          return function(e) {
            $("#cover_drop_zone").hide();
            $("#crop-cover").attr("src", e.target.result);
            coverImage.src = e.target.result;
            coverCropArea = $('#crop-cover').imgAreaSelect({instance: true, aspectRatio: '128:15', imageHeight: coverImage.height, imageWidth: coverImage.width, minWidth: '256', minHeight: '30', x1: '10', y1: '10', x2: '266', y2: '40', parent: ".bubble-create", handles: true, onSelectChange: function(img, selection) {
              coverContext.drawImage(coverImage, selection.x1, selection.y1, selection.width, selection.height, 0, 0, 1280, 150);
              coverRetinaContext.drawImage(coverImage, selection.x1, selection.y1, selection.width, selection.height, 0, 0, 2560, 300);
              $('#coverPhoto').attr('src',coverCanvas.toDataURL());
              $('#coverRetinaPhoto').attr('src',coverRetinaCanvas.toDataURL());
            }});
          };
        })(f);
        reader.readAsDataURL(f);
      }
    }
  },*/

  'click #club': function(evt){
    evt.stopPropagation();
    category = "club";
    $(".nav-tabs li").removeClass('active');
    $("#club").addClass('active');
    $("[name=category]").val("club");
  },

  'click #greek': function(evt){
    evt.stopPropagation();
    category = "greek";
    $(".nav-tabs li").removeClass('active');
    $("#greek").addClass('active');
    $("[name=category]").val("greek");
  },

  'click #art': function(evt){
    evt.stopPropagation();
    category = "art";
    $(".nav-tabs li").removeClass('active');
    $("#art").addClass('active');
    $("[name=category]").val("art");
  },

  'click #sport': function(evt){
    evt.stopPropagation();
    category ="sport";
    $(".nav-tabs li").removeClass('active');
    $("#sport").addClass('active');
    $("[name=category]").val("sport");
  },

  'click #major': function(evt){
    evt.stopPropagation();
    category = "major";
    $(".nav-tabs li").removeClass('active');
    $("#major").addClass('active');
    $("[name=category]").val("major");
  },

  'click #office': function(evt){
    evt.stopPropagation();
    category   = "office";
    $(".nav-tabs li").removeClass('active');
    $("#office").addClass('active');
    $("[name=category]").val("office");
  },

  'click #service': function(evt){
    evt.stopPropagation();
    category = "service";
    $(".nav-tabs li").removeClass('active');
    $("#service").addClass('active');
    $("[name=category]").val("service");
  },

  'click #study': function(evt){
    evt.stopPropagation();
    category = "study";
    $(".nav-tabs li").removeClass('active');
    $("#study").addClass('active');
    $("[name=category]").val("study");
  },

  'click #dorm': function(evt){
    evt.stopPropagation();
    category = "dorm";
    $(".nav-tabs li").removeClass('active');
    $("#dorm").addClass('active');
    $("[name=category]").val("dorm");
  },

  'click #custom': function(evt){
    evt.stopPropagation();
    category = "custom";
    $(".nav-tabs li").removeClass('active');
    $("#custom").addClass('active');
    $("[name=category]").val("custom");
  }

});



Template.bubbleSubmit.events({
  'keyup .required, propertychange .required, input .required, paste .required, mouseout li': function(evt, tmpl) {
      tmpl.validateForm();
  }
});


Template.bubbleSubmit.created = function(){
  mto = "";
  discussionFiles = [];
  discussionDeletedFileIndices = [];
  this.validateForm = function() {
    var count = 0;

    $('#cb-form-container-bubble-create .required').each(function(i) {
      if( !$(this).hasClass('wysiwyg') && $(this).val() === '' && $(this).attr("name") != undefined ) {
        count++;
      } else if ( $(this).hasClass('wysiwyg') && $(this).html().trim().replace("<br>","").replace('<span class="wysiwyg-placeholder">Type here...</span>','') == "" ) {
        count++;
      }


      if (count == 0) {
        $('#cb-form-container-bubble-create .cb-submit').prop('disabled', false);
        $('#cb-form-container-bubble-create .cb-submit').removeClass('ready-false');
      } else {
        $('#cb-form-container-bubble-create .cb-submit').prop('disabled', true);
        $('#cb-form-container-bubble-create .cb-submit').addClass('ready-false');
      }
    });
  }
}





Template.bubbleSubmit.rendered = function(){
  this.validateForm();

  profileRetinaURL = "/img/Bubble-Profile.jpg";
  profileMainURL = "/img/Bubble-Profile.jpg";
  coverRetinaURL = "/img/Bubble-Coverphoto.jpg";
  coverMainURL = "/img/Bubble-Coverphoto.jpg";


  var currentCategory = $("[name=category]").val();
  $("[name=" + currentCategory + "]").addClass("active");

  $(".categoryBox").click(function(){
    var newCategory = $(this).attr("name");
    $("[name=category]").val(newCategory);
     
    $(".categoryBox").removeClass("active");
    $(this).addClass("active");
  });


  //$("#club").addClass('active');
/*
  var currentCategory = $("[name=category]").val();
  $("[name=" + currentCategory + "]").addClass("active");

  $(".categoryBox").click(function(){
    var newCategory = $(this).attr("name");
    $("[name=category]").val(newCategory);
     
    $(".categoryBox").removeClass("active");
    $(this).addClass("active");
  });
*/
  category = null;
  $("#profilepicture_retina").hide();
  $("#coverphoto_retina").hide();
  $("#profilepicture_preview").hide();
  $("#coverphoto_preview").hide();
  $("#tempbubbleprofile").hide();
  $("#tempbubblecoverphoto").hide();


  if($(window).width() < 768)
  {
    Session.set("DisableCrop","1");
  } else {
    Session.set("DisableCrop","");
  }

  //Log clicking of Add bubble button
  /*$(".required").on("click", function() {
    Meteor.clearTimeout(mto);
    mto = Meteor.setTimeout(function() {
      //Logs the action that user is doing
      Meteor.call('createLog', 
        { action: 'click-bubbleTitleTextbox' }, 
        window.location.pathname, 
        function(error) { if(error) { throwError(error.reason); }
      });
    }, 500);
  });*/

  //Log clicking of category
  /*$(".categoryBox").on("click", function() {
    var category = _.find($('.categoryBox'), function(category){
      if(category.className.indexOf('active') !== -1){
        return category;
      }
    });
    //Logs the action that user is doing
    Meteor.call('createLog', 
      { action: 'click-bubbleCategory' }, 
      window.location.pathname, 
      function(error) { if(error) { throwError(error.reason); }
    });
    
  });*/

  //Log clicking of cover photo
  /*$(".attach-cover-photo").on("click", function() {
    Meteor.clearTimeout(mto);
    mto = Meteor.setTimeout(function() {
      //Logs the action that user is doing
      Meteor.call('createLog', 
        { action: 'click-bubbleCoverPhoto' }, 
        window.location.pathname, 
        function(error) { if(error) { throwError(error.reason); }
      });
    }, 500);
  });*/

  //Log clicking of profile photo
  /*$(".attach-profile-photo").on("click", function() {
    Meteor.clearTimeout(mto);
    mto = Meteor.setTimeout(function() {
      //Logs the action that user is doing
      Meteor.call('createLog', 
        { action: 'click-bubbleProfilepicture' }, 
        window.location.pathname, 
        function(error) { if(error) { throwError(error.reason); }
      });
    }, 500);
  });*/

  //Log clicking of description wisiwyg
  /*$(".wysiwyg").on("click", function() {
    Meteor.clearTimeout(mto);
    mto = Meteor.setTimeout(function() {
      //Logs the action that user is doing
      Meteor.call('createLog', 
        { action: 'click-bubbleDescriptionTextbox' }, 
        window.location.pathname, 
        function(error) { if(error) { throwError(error.reason); }
      });
    }, 500);
  });*/

  //Log clicking of submit button
  /*$(".words-main").on("click", function() {
    Meteor.clearTimeout(mto);
    mto = Meteor.setTimeout(function() {
      //Logs the action that user is doing
      Meteor.call('createLog', 
        { action: 'click-bubbleSubmitButton' }, 
        window.location.pathname, 
        function(error) { if(error) { throwError(error.reason); }
      });
    }, 500);
  });*/

  //Log clicking of submit error button
  /*$(".words-error").on("click", function() {
    Meteor.clearTimeout(mto);
    mto = Meteor.setTimeout(function() {
      //Logs the action that user is doing
      Meteor.call('createLog', 
        { action: 'click-bubbleErrorSubmitButton' }, 
        window.location.pathname, 
        function(error) { if(error) { throwError(error.reason); }
      });
    }, 500);
  });*/
}

