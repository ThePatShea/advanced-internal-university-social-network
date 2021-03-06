Template.bubbleEdit.events({
  'click .bubble-edit > .cb-submit-container > .cb-submit': function(e) {
    e.preventDefault();
    
    //Google Analytics
    // _gaq.push(['_trackEvent', 'Bubble', 'Edit', $(event.target).find('[name=title]').val()]);

    var currentBubbleId = Session.get('currentBubbleId');
    
    var bubbleProperties = {
      title: $('.bubble-edit > .first > .title').val(),
      description: $('.cb-form > .wysiwyg_group > .wysiwyg').html(),
      category: $('.bubble-edit > .cb-form-row > .bubble-category > .category').val(),
      lastUpdated: new Date().getTime()
    }


    /*var profilePictureNew        =  $(event.target).find('[id=profilepicture_preview]').attr('src');
    var retinaProfilePictureNew  =  $(event.target).find('[id=profilepicture_retina]').attr('src');
    var coverPhotoNew            =  $(event.target).find('[id=coverphoto_preview]').attr('src');
    var retinaCoverPhotoNew      =  $(event.target).find('[id=coverphoto_retina]').attr('src');

    var profilePictureNew        =  $('#profilePhoto').attr('src');
    var retinaProfilePictureNew  =  $('#profileRetinaPhoto').attr('src');
    var coverPhotoNew            =  $('#coverPhoto').attr('src');
    var retinaCoverPhotoNew      =  $('#coverRetinaPhoto').attr('src');


    if (profilePictureNew != "")
      bubbleProperties.profilePicture  =  profilePictureNew;
    if (retinaProfilePictureNew != "")
      bubbleProperties.retinaProfilePicture  =  retinaProfilePictureNew;
    if (coverPhotoNew != "")
      bubbleProperties.coverPhoto  =  coverPhotoNew;
    if (retinaCoverPhotoNew != "")
      bubbleProperties.retinaCoverPhoto  =  retinaCoverPhotoNew;*/
    
    if(typeof profileMainURL !== "undefined")
      bubbleProperties.profilePicture = profileMainURL;
    if(typeof profileRetinaURL !== "undefined")
      bubbleProperties.retinaProfilePicture = profileRetinaURL;
    if(typeof coverMainURL !== "undefined")
      bubbleProperties.coverPicture = coverMainURL;
    if(typeof coverRetinaURL !== "undefined")
      bubbleProperties.retinaCoverPicture = coverRetinaURL;

    
    Bubbles.update(currentBubbleId, {$set: bubbleProperties}, function(error) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
      } else {
        createBubbleEditUpdate();
        Meteor.Router.to('bubblePage', currentBubbleId);
      }
    });
  },

  'dragover .dropzone': function(evt){
    console.log('Dragover');
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
  },

  'change .cb-form > .attach-profile-photo > .drop-zone': function(evt){

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
                $(".bubble-edit > .attach-profile-photo > .drop-zone").hide();
                $(".bubble-edit > .attach-profile-photo > .drop-zone > .file-chooser-invisible").width(1);
                $(".bubble-edit > .attach-profile-photo > .drop-zone > .file-chooser-invisible").height(1);
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

  'change .cb-form > .attach-cover-photo > .drop-zone': function(evt){

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
                $(".bubble-edit > .attach-cover-photo > .drop-zone").hide();
                $(".bubble-edit > .attach-cover-photo > .drop-zone > .file-chooser-invisible").width(1);
                $(".bubble-edit > .attach-cover-photo > .drop-zone > .file-chooser-invisible").height(1);
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

  
  'click #delete_bubble': function(e) {
    e.preventDefault();
    //Google Analytics
    // _gaq.push(['_trackEvent', 'Bubble', 'Delete', this.title]);
    
    if (confirm("Delete this bubble?")) {

      var currentBubbleId = Session.get('currentBubbleId');
      Meteor.call('deleteBubble', currentBubbleId);
      var bubbles = Bubbles.find({$or: [{'users.members': Meteor.userId()}, {'users.admins': Meteor.userId()}]},{sort: {'users.members': -1, 'users.admins': -1}, limit: 1}).fetch();
      if(bubbles.length > 0) {
        Meteor.Router.to('/mybubbles/' + bubbles[0]._id + '/home');
      }else{
        Meteor.Router.to('searchBubbles');
      }
    }
  }
});










Template.bubbleEdit.events({
  'keyup .required, propertychange .required, input .required, paste .required, mouseout li': function(evt, tmpl) {
      tmpl.validateForm();
  }
});


Template.bubbleEdit.created = function(){
  discussionFiles = [];
  discussionDeletedFileIndices = [];
  this.validateForm = function() {
    var count = 0;

    $('#cb-form-container-bubble-edit .required').each(function(i) {
      if( !$(this).hasClass('wysiwyg') && $(this).val() === '' && $(this).attr("name") != undefined ) {
        count++;
      } else if ( $(this).hasClass('wysiwyg') && $(this).html().trim().replace("<br>","").replace('<span class="wysiwyg-placeholder">Type here...</span>','') == "" ) {
        count++;
      }


      if (count == 0) {
        $('#cb-form-container-bubble-edit .cb-submit').prop('disabled', false);
        $('#cb-form-container-bubble-edit .cb-submit').removeClass('ready-false');
      } else {
        $('#cb-form-container-bubble-edit .cb-submit').prop('disabled', true);
        $('#cb-form-container-bubble-edit .cb-submit').addClass('ready-false');
      }
    });
  }
}











Template.bubbleEdit.rendered = function(){

  if($(window).width() < 768)
  {
    Session.set("DisableCrop","1");
  } else {
    Session.set("DisableCrop","");
  }

  this.validateForm();
  
  $('#coverphoto_retina').hide();
  $('#profilepicture_retina').hide();
  $("#profilepicture_preview").hide();
  $("#coverphoto_preview").hide();
   /*
  $("#change_profilepicture").click(function(){
    $("#profilepicture_preview").hide();
    $("#change_profilepicture").hide();
    $("#profile_dropzone").show();
    $("#profilefilesToUpload").show();
  });

  $("#change_coverphoto").click(function(){
    $("#coverphoto_preview").hide();
    $("#change_coverphoto").hide();
    $("#cover_dropzone").show();
    $("#coverfilesToUpload").show();
  });*/

  var currentBubbleId = Session.get('currentBubbleId');
  var currentbubble = Bubbles.findOne({_id: currentBubbleId});
  /*
  $("#coverfilesToUpload").hide();
  $("#profilefilesToUpload").hide();
  if(currentbubble.coverPhoto.length == 0){
    $("#coverphoto_preview").attr("src", "/img/default_coverphoto.jpg");
  }
  if(currentbubble.profilePicture.length == 0){
    $("#profilepicture_preview").attr("src", "/img/default_bubbleprofilepicture.jpg");
  }
  */
  console.log('Edit Bubble:', this);

  /*category = $("[name=category]").val();

  if(this.category == 'greek'){
    category = "greek";
    $(".nav-tabs li").removeClass('active');
    $("#greek").addClass('active');
    $("[name=category]").val("greek");
  }
  else if(this.category == 'club'){
    category = "club";
    $(".nav-tabs li").removeClass('active');
    $("#club").addClass('active');
    $("[name=category]").val("greek");
  }
  else if(this.category == 'art'){
    category = "greek";
    $(".nav-tabs li").removeClass('active');
    $("#greek").addClass('active');
    $("[name=category]").val("club");
  }
  else if(this.category == 'sport'){
    category = "sport";
    $(".nav-tabs li").removeClass('active');
    $("#sport").addClass('active');
    $("[name=category]").val("sport");
  }
  else if(this.category == 'major'){
    category = "major";
    $(".nav-tabs li").removeClass('active');
    $("#major").addClass('active');
    $("[name=category]").val("major");
  }
  else if(this.category == 'office'){
    category = "office";
    $(".nav-tabs li").removeClass('active');
    $("#office").addClass('active');
    $("[name=category]").val("office");
  }
  else if(this.category == 'service'){
    category = "service";
    $(".nav-tabs li").removeClass('active');
    $("#service").addClass('active');
    $("[name=category]").val("service");
  }
  else if(this.category == 'study'){
    category = "study";
    $(".nav-tabs li").removeClass('active');
    $("#study").addClass('active');
    $("[name=category]").val("study");
  }
  else if(this.category == 'dorm'){
    category = "dorm";
    $(".nav-tabs li").removeClass('active');
    $("#dorm").addClass('active');
    $("[name=category]").val("dorm");
  }
  else if(this.category == 'custom'){
    category = "custom";
    $(".nav-tabs li").removeClass('active');
    $("#custom").addClass('active');
    $("[name=category]").val("custom");
  }*/

    var currentCategory = $("[name=category]").val();
  $("[name=" + currentCategory + "]").addClass("active");

  $(".categoryBox").click(function(){
    var newCategory = $(this).attr("name");
    $("[name=category]").val(newCategory);
     
    $(".categoryBox").removeClass("active");
    $(this).addClass("active");
  });

}
