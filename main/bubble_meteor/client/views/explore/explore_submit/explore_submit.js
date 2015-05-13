Template.exploreSubmit.events({
  'submit form': function(event) {
    event.preventDefault();
    //Google Analytics
    // _gaq.push(['_trackEvent', 'Bubble', 'Create Bubble', $(event.target).find('[name=title]').val()]);

    var exploreProperties = {
      title: $(event.target).find('[name=title]').val(),
      'exploreIcon': $(event.target).find('[name=exploreIcon]').val(),
      description: $(event.target).find('[name=description]').val(),
      //exploreType: $(event.target).find('[name=category]').val(),
      exploreType: selectedExploreType,
      coverPhoto: $(event.target).find('[id=coverphoto_preview]').attr('src'),
      retinaCoverPhoto: $(event.target).find('[id=coverphoto_retina]').attr('src')
    };



    if(exploreProperties.coverPhoto.length == 0){
      var covercanvas = document.createElement('canvas');
      var retinacovercanvas = document.createElement('canvas');
      covercanvas.width = 1280;
      covercanvas.height = 150;
      retinacovercanvas.width = 2560;
      retinacovercanvas.height = 300;
      var covercontext = covercanvas.getContext('2d');
      var retinacovercontext = retinacovercanvas.getContext('2d');
      covercontext.drawImage($('#tempbubblecoverphoto')[0], 0, 0, 1280, 150, 0, 0, 1280, 150);
      retinacovercontext.drawImage($('#tempbubblecoverphoto')[0], 0, 0, 1280, 150, 0, 0, 2560, 300);
      exploreProperties.coverPhoto = covercanvas.toDataURL();
      exploreProperties.retinaCoverPhoto = retinacovercanvas.toDataURL();
    }

    
    Meteor.call('explore', exploreProperties, function(error, exploreId) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
      } else {
        console.log(exploreId);
        var createdExplore = Explores.findOne({_id: exploreId});
        Meteor.Router.to('explorePage', createdExplore._id);
      }
    });
  },

  'dragover .dropzone': function(evt){
    console.log('Dragover');
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
  },

  'drop #cover_dropzone': function(evt){
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
        reader.onload = (function(theFile) {
          return function(e) {
            var coverphoto_width = 1280;
            var coverphoto_height = 150;
            var retina_width = 2560;
            var retina_height = 300;
            $("#cover_dropzone").hide();
            $("#coverfilesToUpload").hide();
            $("#coverphoto_upload").attr("src", e.target.result);
            $("#coverphoto_preview").attr("src", e.target.result);
            $("#coverphoto_upload").attr("title", escape(theFile.name));
            $("#coverphoto_upload").show();
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
              cropwidth = 640;
              cropheight = 75;
              var img = $("#coverphoto_upload")[0]; // Get my img elem
              var pic_real_width, pic_real_height;
              $("<img/>") // Make in memory copy of image to avoid css issues
                  .attr("src", $(img).attr("src"))
                  .load(function() {
                      imagewidth = this.width;   // Note: $(this).width() will not
                      imageheight = this.height; // work for in memory images.
                      $('#coverphoto_upload').jrac({'crop_width': cropwidth, 'crop_height': cropheight, 'image_width': imagewidth, 'image_height': imageheight, 'viewport_width': imagewidth, 'viewport_height': imageheight, 'viewport_onload': function(){
                                        console.log('Viewport loaded.');
                                        $(".jrac_zoom_slider").hide();
                                        $(".ui-resizable-handle").hide();
                                           var $viewport = this;
                                           $viewport.observator.register('jrac_crop_x', $(document), function(element, event_name, value){
                                              cropx = value;
                                              console.log("x, y: ", cropx, cropy);
                                              mycontext.drawImage($("#coverphoto_upload")[0], cropx, cropy, cropwidth, cropheight, 0, 0, coverphoto_width, coverphoto_height);
                                              retinacontext.drawImage($("#coverphoto_upload")[0], cropx, cropy, cropwidth, cropheight, 0, 0, retina_width, retina_height);
                                              //var tempimagedata = tempcanvas.toDataURL();
                                              //$("#userprofilepicture_preview").attr("src", tempimagedata);
                                              //console.log($(".jrac_crop_drag_handler").position());
                                              var imagedata = mycanvas.toDataURL();
                                              var retinaImageData = retinacanvas.toDataURL();
                                              $("#coverphoto_preview").attr("src", imagedata);
                                              $("#coverphoto_preview").attr("width", coverphoto_width/2);
                                              $("#coverphoto_preview").attr("height", coverphoto_height/2);
                                              $("#coverphoto_retina").attr("src", retinaImageData);
                                            });
                                           $viewport.observator.register('jrac_crop_y', $(document), function(element, event_name, value){
                                              cropy = value;
                                              console.log("x, y: ", cropx, cropy);
                                              mycontext.drawImage($("#coverphoto_upload")[0], cropx, cropy, cropwidth, cropheight, 0, 0, coverphoto_width, coverphoto_height);
                                              //var tempimagedata = tempcanvas.toDataURL();
                                              //$("#userprofilepicture_preview").attr("src", tempimagedata);
                                              //console.log($(".jrac_crop_drag_handler").position());
                                              var imagedata = mycanvas.toDataURL();
                                              var retinaImageData = retinacanvas.toDataURL();
                                              $("#coverphoto_preview").attr("src", imagedata);
                                              $("#coverphoto_preview").attr("width", coverphoto_width/2);
                                              $("#coverphoto_preview").attr("height", coverphoto_height/2);
                                              $("#coverphoto_retina").attr("src", retinaImageData);
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


  'change #coverfilesToUpload': function(evt){


    var files = evt.target.files;


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



        // Read in the image file as a data URL.

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
          return function(e) {
            var coverphoto_width = 1280;
            var coverphoto_height = 150;
            var retina_width = 2560;
            var retina_height = 300;
            $("#cover_dropzone").hide();
            $("#coverfilesToUpload").hide();
            $("#coverphoto_upload").attr("src", e.target.result);
            $("#coverphoto_preview").attr("src", e.target.result);
            $("#coverphoto_upload").attr("title", escape(theFile.name));
            $("#coverphoto_upload").show();
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
              cropwidth = 640;
              cropheight = 75;
              var img = $("#coverphoto_upload")[0]; // Get my img elem
              var pic_real_width, pic_real_height;
              $("<img/>") // Make in memory copy of image to avoid css issues
                  .attr("src", $(img).attr("src"))
                  .load(function() {
                      imagewidth = this.width;   // Note: $(this).width() will not
                      imageheight = this.height; // work for in memory images.
                      $('#coverphoto_upload').jrac({'crop_width': cropwidth, 'crop_height': cropheight, 'image_width': imagewidth, 'image_height': imageheight, 'viewport_width': imagewidth, 'viewport_height': imageheight, 'viewport_onload': function(){
                                        console.log('Viewport loaded.');
                                        $(".jrac_zoom_slider").hide();
                                        $(".ui-resizable-handle").hide();
                                           var $viewport = this;
                                           $viewport.observator.register('jrac_crop_x', $(document), function(element, event_name, value){
                                              cropx = value;
                                              console.log("x, y: ", cropx, cropy);
                                              mycontext.drawImage($("#coverphoto_upload")[0], cropx, cropy, cropwidth, cropheight, 0, 0, coverphoto_width, coverphoto_height);
                                              retinacontext.drawImage($("#coverphoto_upload")[0], cropx, cropy, cropwidth, cropheight, 0, 0, retina_width, retina_height);
                                              //var tempimagedata = tempcanvas.toDataURL();
                                              //$("#userprofilepicture_preview").attr("src", tempimagedata);
                                              //console.log($(".jrac_crop_drag_handler").position());
                                              var imagedata = mycanvas.toDataURL();
                                              var retinaImageData = retinacanvas.toDataURL();
                                              $("#coverphoto_preview").attr("src", imagedata);
                                              $("#coverphoto_preview").attr("width", coverphoto_width/2);
                                              $("#coverphoto_preview").attr("height", coverphoto_height/2);
                                              $("#coverphoto_retina").attr("src", retinaImageData);
                                            });
                                           $viewport.observator.register('jrac_crop_y', $(document), function(element, event_name, value){
                                              cropy = value;
                                              console.log("x, y: ", cropx, cropy);
                                              mycontext.drawImage($("#coverphoto_upload")[0], cropx, cropy, cropwidth, cropheight, 0, 0, coverphoto_width, coverphoto_height);
                                              //var tempimagedata = tempcanvas.toDataURL();
                                              //$("#userprofilepicture_preview").attr("src", tempimagedata);
                                              //console.log($(".jrac_crop_drag_handler").position());
                                              var imagedata = mycanvas.toDataURL();
                                              var retinaImageData = retinacanvas.toDataURL();
                                              $("#coverphoto_preview").attr("src", imagedata);
                                              $("#coverphoto_preview").attr("width", coverphoto_width/2);
                                              $("#coverphoto_preview").attr("height", coverphoto_height/2);
                                              $("#coverphoto_retina").attr("src", retinaImageData);
                                            });
                                      }
                      });
                  });
              



            });

          };
        })(f);

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


Template.exploreSubmit.rendered = function(){
  $("#profilepicture_retina").hide();
  $("#coverphoto_retina").hide();
  $("#profilepicture_preview").hide();
  $("#coverphoto_preview").hide();
  $("#tempbubbleprofile").hide();
  $("#tempbubblecoverphoto").hide();
};


Template.exploreSubmit.helpers({
  hasLevel4Permission: function(){
      return ('4' == Meteor.user().userType && this.userType != '4');
    }
});

