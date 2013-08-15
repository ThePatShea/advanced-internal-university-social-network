Template.bubbleSubmit.events({
/*  'click .cb-submit': function(event, tmpl) {
    event.preventDefault();
    //Google Analytics
    // _gaq.push(['_trackEvent', 'Bubble', 'Create Bubble', $(event.target).find('[name=title]').val()]);

    var bubble = {
      title: $('.cb-form').find('[name=title]').val(),
      description: $('.cb-form').find('[name=body]').html(),
      //category: $(event.target).find('[name=category]').val(),
      'category': category,
      coverPhoto: $('#coverPhoto').attr('src'),
      retinaCoverPhoto: $('#coverRetinaPhoto').attr('src'),
      profilePicture: $('#profilePhoto').attr('src'),
      retinaProfilePicture: $('#profileRetinaPhoto').attr('src'),
      bubbleType: $('.cb-form').find('[name=bubbleType]').val()
    };

    Meteor.call('bubble', bubble, function(error, bubbleId) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
      } else {
        Meteor.Router.to('bubblePage', bubbleId);
      }
    });
  },
*/
  'click .bubble-create > .cb-submit-container > .cb-submit': function(event) {
    event.preventDefault();
    event.stopPropagation();
    console.log('Bubble Submit');

    var bubble = {
      //category             : $('.cb-form').find('[name=category]').val(),
      'category'           : category,
      bubbleType           : $('.cb-form').find('[name=bubbleType]').val(),
      description          : $('.cb-form').find('[name=body]').html(),
      title                : $('.cb-form').find('[name=title]').val(),
      retinaProfilePicture : $('#profileRetinaPhoto').attr('src'),
      retinaCoverPhoto     : $('#coverRetinaPhoto').attr('src'),
      profilePicture       : $('#profilePhoto').attr('src'),
      coverPhoto           : $('#coverPhoto').attr('src'),
    };

    Meteor.call('bubble', bubble, function(error, bubbleId) {
      if (error) {
        throwError(error.reason);
      } else {
        Meteor.Router.to('bubblePage', bubbleId);
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

        var mainCanvas = document.getElementById('cover-main-canvas');
        var retinaCanvas = document.getElementById('cover-retina-canvas');
        var mainContext = mainCanvas.getContext('2d');
        var retinaContext = retinaCanvas.getContext('2d');
        var profileImage = new Image();

            // Closure to capture the file information.
            reader.onload = (function(theFile) {
              return function(e) {
                  $(".bubble-create > .attach-cover-photo > .drop-zone").hide();
                  $(".bubble-create > .attach-cover-photo > .drop-zone > .file-chooser-invisible").width(1);
                  $(".bubble-create > .attach-cover-photo > .drop-zone > .file-chooser-invisible").height(1);
                  $(".bubble-create > .crop-profile > .crop").attr("src", e.target.result);
                  profileImage.src = e.target.result;
                  cropArea = $('.bubble-create > .crop-profile > .crop').imgAreaSelect({instance: true, aspectRatio: '1:1', imageHeight: profileImage.height, imageWidth: profileImage.width, minWidth: '67', minHeight: '67', x1: '10', y1: '10', x2: '77', y2: '77', parent: ".cb-form-container", handles: true, onSelectChange: function(img, selection) {
                mainContext.drawImage(profileImage, selection.x1, selection.y1, selection.width, selection.height, 0, 0, 160, 160);
                retinaContext.drawImage(profileImage, selection.x1, selection.y1, selection.width, selection.height, 0, 0, 320, 320);
                mainURL = mainCanvas.toDataURL();
                retinaURL = retinaCanvas.toDataURL();
                $(".profile-pic-preview").attr("src",mainURL);
                  }});
              };
            })(f);
            reader.readAsDataURL(f);
        }
      }
    
  },

  'dragover .bubble-create > .attach-profile-picture > .drop-zone': function(evt){
    console.log('profile Dragover');
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
  },

  'drop .bubble-create > .attach-profile-picture > .drop-zone': function(evt){
    console.log('profile drop');
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
  },

  'change .bubble-create > .attach-profile-picture > .drop-zone > .file-chooser-invisible': function(evt){

    evt.stopPropagation();
    evt.preventDefault();

    console.log('Dropzone profile change: ', evt.target.files);
    
  },

  'change .bubble-create > .attach-profile-picture > .drop-zone > .file-chooser-invisible': function(evt){
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

        var profileCanvas = document.getElementById('profile-main-canvas');
        var profileRetinaCanvas = document.getElementById('profile-retina-canvas');
        var profileContext = profileCanvas.getContext('2d');
        var profileRetinaContext = profileRetinaCanvas.getContext('2d');
        var profileImage = new Image();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
          return function(e) {
            $(".bubble-create > .attach-profile-picture > .drop-zone").hide();
            $(".crop-profile > .crop").attr("src", e.target.result);
            profileImage.src = e.target.result;
            profileCropArea = $('.crop-profile > .crop').imgAreaSelect({instance: true, aspectRatio: '1:1', imageHeight: profileImage.height, imageWidth: profileImage.width, minWidth: '100', minHeight: '100', x1: '10', y1: '10', x2: '110', y2: '110', parent: ".bubble-create", handles: true, onSelectChange: function(img, selection) {
              profileContext.drawImage(profileImage, selection.x1, selection.y1, selection.width, selection.height, 0, 0, 300, 300);
              profileRetinaContext.drawImage(profileImage, selection.x1, selection.y1, selection.width, selection.height, 0, 0, 600, 600);
              $('#profilePhoto').attr('src',profileCanvas.toDataURL());
              $('#profileRetinaPhoto').attr('src',profileRetinaCanvas.toDataURL());
            }});
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


Template.bubbleSubmit.rendered = function(){
  //$("#club").addClass('active');

  var currentCategory = $("[name=category]").val();
  $("[name=" + currentCategory + "]").addClass("active");

  $(".categoryBox").click(function(){
    var newCategory = $(this).attr("name");
    $("[name=category]").val(newCategory);
     
    $(".categoryBox").removeClass("active");
    $(this).addClass("active");
  });

  category = null;
  $("#profilepicture_retina").hide();
  $("#coverphoto_retina").hide();
  $("#profilepicture_preview").hide();
  $("#coverphoto_preview").hide();
  $("#tempbubbleprofile").hide();
  $("#tempbubblecoverphoto").hide();
}

