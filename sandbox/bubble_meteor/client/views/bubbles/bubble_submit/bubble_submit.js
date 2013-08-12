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
  'dragover .dropzone': function(evt){
    console.log('Dragover');
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
  },

  'change #profilefilesToUpload': function(evt){
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

        var profileCanvas = document.getElementById('profile-canvas');
        var profileRetinaCanvas = document.getElementById('profile-retina-canvas');
        var profileContext = profileCanvas.getContext('2d');
        var profileRetinaContext = profileRetinaCanvas.getContext('2d');
        var profileImage = new Image();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
          return function(e) {
            $("#profile_drop_zone").hide();
            $("#crop-profile").attr("src", e.target.result);
            profileImage.src = e.target.result;
            profileCropArea = $('#crop-profile').imgAreaSelect({instance: true, aspectRatio: '1:1', imageHeight: profileImage.height, imageWidth: profileImage.width, minWidth: '100', minHeight: '100', x1: '10', y1: '10', x2: '110', y2: '110', parent: ".bubble-create", handles: true, onSelectChange: function(img, selection) {
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

  'change #coverfilesToUpload': function(evt){
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
  },

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
  category = null;
  $("#profilepicture_retina").hide();
  $("#coverphoto_retina").hide();
  $("#profilepicture_preview").hide();
  $("#coverphoto_preview").hide();
  $("#tempbubbleprofile").hide();
  $("#tempbubblecoverphoto").hide();
}

