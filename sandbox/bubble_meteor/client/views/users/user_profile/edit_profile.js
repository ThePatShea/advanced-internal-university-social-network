Template.userProfileEdit.helpers({
	getProfile: function() {
		return Meteor.users.findOne({_id:Session.get('selectedUserId')});
	},
	getEmail: function() {
    if(this.emails) {
      return this.emails[0].address;
    }
	},
	hasPermission: function() {
		var profileId = Session.get('selectedUserId');
		var user = Meteor.user();
		if('megauser' == Meteor.user().userType || user._id == profileId){
			return true;
		}
		else{
			return false;
		}
	},
  checkUserType: function(type) {
    if(this.userType == type) {
      return 'selected';
    }
  }

});


Template.userProfileEdit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var currentProfileId = Session.get('selectedUserId');
    //var dateTime = $(event.target).find('[name=date]').val() + " " + $(event.target).find('[name=time]').val();
    
    var profileProperties = {
      profilePicture: $(e.target).find('[id=userprofilepicture_preview]').attr('src'),
      retinaProfilePicture: $(e.target).find('[id=userprofilepicture_retina]').attr('src'),
      emails: [{'address': $(e.target).find('[name=email]').val(), 'verified': false}],
      phone: '',
      lastUpdated: new Date().getTime(),
      userType: $(e.target).find('[name=userType]').val()
    };
    console.log('Properties to be saved: ',profileProperties);
    
    Meteor.users.update(currentProfileId, {$set: profileProperties}, function(error) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
      } else {
        Meteor.Router.to('userProfile', currentProfileId);
      }
    });

  },

  'dragover .dropzone': function(evt){
    console.log('Dragover');
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
  },

  'drop .dropzone': function(evt){
    console.log('Drop');
        evt.stopPropagation();
    evt.preventDefault();

    files = evt.dataTransfer.files;

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

        // Closure to capture the file information.
        /*reader.onload = (function(theFile) {
          return function(e) {
            var coverphoto_width = 160;
            var coverphoto_height = 160;
            var retina_width = 320;
            var retina_height = 320;
            $("#userprofilepicture_dropzone").hide();
            $("#userprofilepicture_upload").attr("src", e.target.result);
            $("#userprofilepicture_preview").attr("src", e.target.result);
            $("#userprofilepicture_upload").attr("title", escape(theFile.name));
            $("#userprofilepicture_upload").show();
            $("#userprofilepicture_preview").show();
            $(document).ready( function(){
              $(function(){
                function showPreview(coords){
                  var mycanvas = document.createElement('canvas');
                  var retinacanvas = document.createElement('canvas');
                  var mycontext = mycanvas.getContext('2d');
                  var retinacontext = retinacanvas.getContext('2d');
                  mycanvas.width = coverphoto_width;
                  mycanvas.height = coverphoto_height;
                  retinacanvas.width = retina_width;
                  retinacanvas.height = retina_height;
                  console.log(coords);
                  mycontext.drawImage($("#userprofilepicture_upload")[0], coords.x, coords.y, (coords.x2 - coords.x), (coords.y2 - coords.y), 0, 0, coverphoto_width, coverphoto_height);
                  retinacontext.drawImage($("#userprofilepicture_upload")[0], coords.x, coords.y, (coords.x2 - coords.x), (coords.y2 - coords.y), 0, 0, retina_width, retina_height);
                  var imagedata = mycanvas.toDataURL();
                  var retinaImageData = retinacanvas.toDataURL();
                  $("#userprofilepicture_preview").attr("src", imagedata);
                  $("#userprofilepicture_preview").attr("width", coverphoto_width/2);
                  $("#userprofilepicture_preview").attr("height", coverphoto_height/2);
                  $("#userprofilepicture_retina").attr("src", retinaImageData);
                };

                $('#userprofilepicture_upload').Jcrop({
                  onChange: showPreview,
                  onSelect: showPreview,
                  setSelect:   [ 50, 50, coverphoto_width, coverphoto_height ],
                  aspectRatio: coverphoto_width/coverphoto_height
                }, function(){
                  jcrop_api = this;
                  jcrop_api.setOptions({ allowResize: false });
                });

              });
            });
          };
        })(f);*/

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
          return function(e) {
            var coverphoto_width = 160;
            var coverphoto_height = 160;
            var retina_width = 320;
            var retina_height = 320;
            $("#userprofilepicture_dropzone").hide();
            $("#userprofilepicture_upload").attr("src", e.target.result);
            $("#userprofilepicture_preview").attr("src", e.target.result);
            $("#userprofilepicture_upload").attr("title", escape(theFile.name));
            $("#userprofilepicture_upload").show();
            $("#userprofilepicture_preview").show();
            $(document).ready(function(){
              // Apply jrac on some image.
              var tempcanvas = document.createElement('canvas');
              var tempcontext = tempcanvas.getContext('2d');
              var mycanvas = document.createElement('canvas');
              var retinacanvas = document.createElement('canvas');
              var mycontext = mycanvas.getContext('2d');
              var retinacontext = retinacanvas.getContext('2d');
              mycanvas.width = coverphoto_width;
              mycanvas.height = coverphoto_height;
              retinacanvas.width = retina_width;
              retinacanvas.height = retina_height;
              var cropx, cropy, cropwidth, cropheight, imagewidth, imageheight;
              cropwidth = 150;
              cropheight = 150;
              var img = $("#userprofilepicture_upload")[0]; // Get my img elem
              var pic_real_width, pic_real_height;
              $("<img/>") // Make in memory copy of image to avoid css issues
                  .attr("src", $(img).attr("src"))
                  .load(function() {
                      imagewidth = this.width;   // Note: $(this).width() will not
                      imageheight = this.height; // work for in memory images.
                      $('#userprofilepicture_upload').jrac({'crop_width': cropwidth, 'crop_height': cropheight, 'image_width': imagewidth, 'image_height': imageheight, 'viewport_width': imagewidth, 'viewport_height': imageheight, 'viewport_onload': function(){
                                        console.log('Viewport loaded.');
                                        $(".jrac_zoom_slider").hide();
                                        $(".ui-resizable-handle").hide();
                                           var $viewport = this;
                                           $viewport.observator.register('jrac_crop_x', $(document), function(element, event_name, value){
                                              cropx = value;
                                              //console.log("x, y: ", cropx, cropy);
                                              mycontext.drawImage($("#userprofilepicture_upload")[0], cropx, cropy, cropwidth, cropheight, 0, 0, coverphoto_width, coverphoto_height);
                                              retinacontext.drawImage($("#userprofilepicture_upload")[0], cropx, cropy, cropwidth, cropheight, 0, 0, retina_width, retina_height);
                                              //var tempimagedata = tempcanvas.toDataURL();
                                              //$("#userprofilepicture_preview").attr("src", tempimagedata);
                                              //console.log($(".jrac_crop_drag_handler").position());
                                              var imagedata = mycanvas.toDataURL();
                                              var retinaImageData = retinacanvas.toDataURL();
                                              $("#userprofilepicture_preview").attr("src", imagedata);
                                              $("#userprofilepicture_preview").attr("width", coverphoto_width/2);
                                              $("#userprofilepicture_preview").attr("height", coverphoto_height/2);
                                              $("#userprofilepicture_retina").attr("src", retinaImageData);
                                            });
                                           $viewport.observator.register('jrac_crop_y', $(document), function(element, event_name, value){
                                              cropy = value;
                                              //console.log("x, y: ", cropx, cropy);
                                              mycontext.drawImage($("#userprofilepicture_upload")[0], cropx, cropy, cropwidth, cropheight, 0, 0, coverphoto_width, coverphoto_height);
                                              //var tempimagedata = tempcanvas.toDataURL();
                                              //$("#userprofilepicture_preview").attr("src", tempimagedata);
                                              //console.log($(".jrac_crop_drag_handler").position());
                                              var imagedata = mycanvas.toDataURL();
                                              var retinaImageData = retinacanvas.toDataURL();
                                              $("#userprofilepicture_preview").attr("src", imagedata);
                                              $("#userprofilepicture_preview").attr("width", coverphoto_width/2);
                                              $("#userprofilepicture_preview").attr("height", coverphoto_height/2);
                                              $("#userprofilepicture_retina").attr("src", retinaImageData);
                                            });
                                      }
                      });
                  });
              



            });

          };
        })(f);

        // Read in the image file as a data URL.
        reader.readAsDataURL(f);

      }

      //If the file dropped on the dropzone is not an image then throw an error to the user
      else{
        error = new Meteor.Error(422, 'Please choose a valid image.');
        throwError(error.reason);
      }
    }

  },


  'change #filesToUpload': function(evt){
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

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
          return function(e) {
            var coverphoto_width = 160;
            var coverphoto_height = 160;
            var retina_width = 320;
            var retina_height = 320;
            $("#userprofilepicture_dropzone").hide();
            $("#userprofilepicture_upload").attr("src", e.target.result);
            $("#userprofilepicture_preview").attr("src", e.target.result);
            $("#userprofilepicture_upload").attr("title", escape(theFile.name));
            $("#userprofilepicture_upload").show();
            $("#userprofilepicture_preview").show();
            $(document).ready(function(){
              // Apply jrac on some image.
              var tempcanvas = document.createElement('canvas');
              var tempcontext = tempcanvas.getContext('2d');
              var mycanvas = document.createElement('canvas');
              var retinacanvas = document.createElement('canvas');
              var mycontext = mycanvas.getContext('2d');
              var retinacontext = retinacanvas.getContext('2d');
              mycanvas.width = coverphoto_width;
              mycanvas.height = coverphoto_height;
              retinacanvas.width = retina_width;
              retinacanvas.height = retina_height;
              var cropx, cropy, cropwidth, cropheight, imagewidth, imageheight;
              cropwidth = 150;
              cropheight = 150;
              var img = $("#userprofilepicture_upload")[0]; // Get my img elem
              var pic_real_width, pic_real_height;
              $("<img/>") // Make in memory copy of image to avoid css issues
                  .attr("src", $(img).attr("src"))
                  .load(function() {
                      imagewidth = this.width;   // Note: $(this).width() will not
                      imageheight = this.height; // work for in memory images.
                      $('#userprofilepicture_upload').jrac({'crop_width': cropwidth, 'crop_height': cropheight, 'image_width': imagewidth, 'image_height': imageheight, 'viewport_width': imagewidth, 'viewport_height': imageheight, 'viewport_onload': function(){
                                        console.log('Viewport loaded.');
                                        $(".jrac_zoom_slider").hide();
                                        $(".ui-resizable-handle").hide();
                                           var $viewport = this;
                                           $viewport.observator.register('jrac_crop_x', $(document), function(element, event_name, value){
                                              cropx = value;
                                              //console.log("x, y: ", cropx, cropy);
                                              mycontext.drawImage($("#userprofilepicture_upload")[0], cropx, cropy, cropwidth, cropheight, 0, 0, coverphoto_width, coverphoto_height);
                                              retinacontext.drawImage($("#userprofilepicture_upload")[0], cropx, cropy, cropwidth, cropheight, 0, 0, retina_width, retina_height);
                                              //var tempimagedata = tempcanvas.toDataURL();
                                              //$("#userprofilepicture_preview").attr("src", tempimagedata);
                                              //console.log($(".jrac_crop_drag_handler").position());
                                              var imagedata = mycanvas.toDataURL();
                                              var retinaImageData = retinacanvas.toDataURL();
                                              $("#userprofilepicture_preview").attr("src", imagedata);
                                              $("#userprofilepicture_preview").attr("width", coverphoto_width/2);
                                              $("#userprofilepicture_preview").attr("height", coverphoto_height/2);
                                              $("#userprofilepicture_retina").attr("src", retinaImageData);
                                            });
                                           $viewport.observator.register('jrac_crop_y', $(document), function(element, event_name, value){
                                              cropy = value;
                                              //console.log("x, y: ", cropx, cropy);
                                              mycontext.drawImage($("#userprofilepicture_upload")[0], cropx, cropy, cropwidth, cropheight, 0, 0, coverphoto_width, coverphoto_height);
                                              //var tempimagedata = tempcanvas.toDataURL();
                                              //$("#userprofilepicture_preview").attr("src", tempimagedata);
                                              //console.log($(".jrac_crop_drag_handler").position());
                                              var imagedata = mycanvas.toDataURL();
                                              var retinaImageData = retinacanvas.toDataURL();
                                              $("#userprofilepicture_preview").attr("src", imagedata);
                                              $("#userprofilepicture_preview").attr("width", coverphoto_width/2);
                                              $("#userprofilepicture_preview").attr("height", coverphoto_height/2);
                                              $("#userprofilepicture_retina").attr("src", retinaImageData);
                                            });
                                      }
                      });
                  });
              



            });

          };
        })(f);

        // Read in the image file as a data URL.
        reader.readAsDataURL(f);

      }

      //If the file dropped on the dropzone is not an image then throw an error to the user
      else{
        error = new Meteor.Error(422, 'Please choose a valid image.');
        throwError(error.reason);
      }
    }
  }
});

Template.userProfileEdit.rendered = function(){
  $("#userprofilepicture_retina").hide();
  $("#change_profile_picture").click(function(){
    $("#userprofilepicture_preview").hide();
    $("#change_profile_picture").hide();
    $(".dropzone").show();
    $("#filesToUpload").show();
  });
  var user = Meteor.users.findOne({_id:Session.get('selectedUserId')});
  if(!user.profilePicture){
    //$(".userprofilepicture").attr("src", "/img/default_userprofile.png");
    $("#userprofilepicture_preview").attr("src", "/img/default_userprofile.png");
    $(".dropzone").hide();
    $("#filesToUpload").hide();
    //$(".dropzone").show();
  }
  else{
    $(".dropzone").hide();
    $("#filesToUpload").hide();
  }
};


