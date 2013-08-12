Template.bubbleEdit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    //Google Analytics
    // _gaq.push(['_trackEvent', 'Bubble', 'Edit', $(event.target).find('[name=title]').val()]);

    var currentBubbleId = Session.get('currentBubbleId');
    
    var bubbleProperties = {
      title: $(e.target).find('[name=title]').val(),
      description: $(e.target).find('[name=body]').html(),
      category: $(e.target).find('[name=category]').val(),
      lastUpdated: new Date().getTime()
    }


    var profilePictureNew        =  $(event.target).find('[id=profilepicture_preview]').attr('src');
    var retinaProfilePictureNew  =  $(event.target).find('[id=profilepicture_retina]').attr('src');
    var coverPhotoNew            =  $(event.target).find('[id=coverphoto_preview]').attr('src');
    var retinaCoverPhotoNew      =  $(event.target).find('[id=coverphoto_retina]').attr('src');


    if (profilePictureNew != "")
      bubbleProperties.profilePicture  =  profilePictureNew;
    if (retinaProfilePictureNew != "")
      bubbleProperties.retinaProfilePicture  =  retinaProfilePictureNew;
    if (coverPhotoNew != "")
      bubbleProperties.coverPhoto  =  coverPhotoNew;
    if (retinaCoverPhotoNew != "")
      bubbleProperties.retinaCoverPhoto  =  retinaCoverPhotoNew;
    

    
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

  
  'click #delete_bubble': function(e) {
    e.preventDefault();
    //Google Analytics
    // _gaq.push(['_trackEvent', 'Bubble', 'Delete', this.title]);
    
    if (confirm("Delete this bubble?")) {

      var currentBubbleId = Session.get('currentBubbleId');
      Bubbles.remove(currentBubbleId);
      var bubbles = Bubbles.find({$or: [{'users.members': Meteor.userId()}, {'users.admins': Meteor.userId()}]},{sort: {'users.members': -1, 'users.admins': -1}, limit: 1}).fetch();
      if(bubbles.length > 0) {
        Meteor.Router.to('/mybubbles/' + bubbles[0]._id + '/home');
      }else{
        Meteor.Router.to('searchBubbles');
      }
    }
  }
});


Template.bubbleEdit.rendered = function(){
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
}
