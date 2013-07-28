Template.bubbleSubmit.events({
  'click .cb-submit': function(event) {
    event.preventDefault();
    //Google Analytics
    // _gaq.push(['_trackEvent', 'Bubble', 'Create Bubble', $(event.target).find('[name=title]').val()]);

    var bubble = {
      title: $('.cb-form').find('[name=title]').val(),
      description: $('.cb-form').find('[name=description]').val(),
      //category: $(event.target).find('[name=category]').val(),
      'category': category,
      coverPhoto: $('.cb-form').find('[id=coverphoto_preview]').attr('src'),
      retinaCoverPhoto: $('.cb-form').find('[id=coverphoto_retina]').attr('src'),
      profilePicture: $('.cb-form').find('[id=profilepicture_preview]').attr('src'),
      retinaProfilePicture: $('.cb-form').find('[id=profilepicture_retina]').attr('src'),
      bubbleType: $('.cb-form').find('[name=bubbleType]').val()
    };


    if(bubble.coverPhoto){
      if(bubble.coverPhoto.length == 0){
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
        bubble.coverPhoto = covercanvas.toDataURL();
        bubble.retinaCoverPhoto = retinacovercanvas.toDataURL();
      }
      if(bubble.profilePicture.length == 0){
        var profilecanvas = document.createElement('canvas');
        var retinaprofilecanvas = document.createElement('canvas');
        profilecanvas.width = 300;
        profilecanvas.height = 300;
        retinaprofilecanvas.width = 600;
        retinaprofilecanvas.height = 600;
        var profilecontext = profilecanvas.getContext('2d');
        var retinaprofilecontext = retinaprofilecanvas.getContext('2d');
        profilecontext.drawImage($('#tempbubbleprofile')[0], 0, 0, 300, 300);
        retinaprofilecontext.drawImage($('#tempbubbleprofile')[0], 0, 0, 600, 600);
        bubble.profilePicture = profilecanvas.toDataURL();
        bubble.retinaProfilePicture = retinaprofilecanvas.toDataURL();
      }
    }
    
    Meteor.call('bubble', bubble, function(error, bubbleId) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
      } else {
        Meteor.Router.to('bubblePage', bubbleId);
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

    var files = evt.dataTransfer.files;

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
            $(document).ready( function(){
              $(function(){
                function showPreview(coords){
                  var mycanvas = document.createElement('canvas');
                  var retinacanvas = document.createElement('canvas');
                  mycanvas.width = coverphoto_width;
                  mycanvas.height = coverphoto_height;
                  retinacanvas.width = retina_width;
                  retinacanvas.height = retina_height;
                  console.log(coords);
                  var mycontext = mycanvas.getContext('2d');
                  var retinacontext = retinacanvas.getContext('2d');
                  mycontext.drawImage($("#coverphoto_upload")[0], coords.x, coords.y, (coords.x2 - coords.x), (coords.y2 - coords.y), 0, 0, coverphoto_width, coverphoto_height);
                  retinacontext.drawImage($("#coverphoto_upload")[0], coords.x, coords.y, (coords.x2 - coords.x), (coords.y2 - coords.y), 0, 0, retina_width, retina_height);
                  var imagedata = mycanvas.toDataURL();
                  var retinaImageData = retinacanvas.toDataURL();
                  $("#coverphoto_preview").attr("src", imagedata);
                  $("#coverphoto_preview").attr("width", coverphoto_width/2);
                  $("#coverphoto_preview").attr("height", coverphoto_height/2);
                  $("#coverphoto_retina").attr("src", retinaImageData);
                };

                $('#coverphoto_upload').Jcrop({
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

        // Closure to capture the file information.
        /*reader.onload = (function(theFile) {
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
            $(document).ready( function(){
              $(function(){
                function showPreview(coords){
                  var mycanvas = document.createElement('canvas');
                  var retinacanvas = document.createElement('canvas');
                  mycanvas.width = coverphoto_width;
                  mycanvas.height = coverphoto_height;
                  retinacanvas.width = retina_width;
                  retinacanvas.height = retina_height;
                  console.log(coords);
                  var mycontext = mycanvas.getContext('2d');
                  var retinacontext = retinacanvas.getContext('2d');
                  mycontext.drawImage($("#coverphoto_upload")[0], coords.x, coords.y, (coords.x2 - coords.x), (coords.y2 - coords.y), 0, 0, coverphoto_width, coverphoto_height);
                  retinacontext.drawImage($("#coverphoto_upload")[0], coords.x, coords.y, (coords.x2 - coords.x), (coords.y2 - coords.y), 0, 0, retina_width, retina_height);
                  var imagedata = mycanvas.toDataURL();
                  var retinaImageData = retinacanvas.toDataURL();
                  $("#coverphoto_preview").attr("src", imagedata);
                  $("#coverphoto_preview").attr("width", coverphoto_width/2);
                  $("#coverphoto_preview").attr("height", coverphoto_height/2);
                  $("#coverphoto_retina").attr("src", retinaImageData);
                };

                $('#coverphoto_upload').Jcrop({
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

  },

  'drop #profile_dropzone': function(evt){
    console.log('Drop');
        evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files;

    //If more than one file dropped on the dropzone then throw an error to the user
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
            var profilepicture_width = 300;
            var profilepicture_height = 300;
            var retina_width = 600;
            var retina_height = 600;
            $("#profile_dropzone").hide();
            $("#profilefilesToUpload").hide();
            $("#profilepicture_upload").attr("src", e.target.result);
            $("#profilepicture_preview").attr("src", e.target.result);
            $("#profilepicture_upload").attr("title", escape(theFile.name));
            $("#profilepicture_upload").show();
            $(document).ready( function(){
              $(function(){
                function showPreview(coords){
                  var mycanvas = document.createElement('canvas');
                  var retinacanvas = document.createElement('canvas');
                  mycanvas.width = profilepicture_width;
                  mycanvas.height = profilepicture_height;
                  retinacanvas.width = retina_width;
                  retinacanvas.height = retina_height;
                  console.log(coords);
                  var mycontext = mycanvas.getContext('2d');
                  var retinacontext = retinacanvas.getContext('2d');
                  mycontext.drawImage($("#profilepicture_upload")[0], coords.x, coords.y, (coords.x2 - coords.x), (coords.y2 - coords.y), 0, 0, profilepicture_width, profilepicture_height);
                  retinacontext.drawImage($("#profilepicture_upload")[0], coords.x, coords.y, (coords.x2 - coords.x), (coords.y2 - coords.y), 0, 0, retina_width, retina_height);
                  var imagedata = mycanvas.toDataURL();
                  var retinaImageData = retinacanvas.toDataURL();
                  $("#profilepicture_preview").attr("src", imagedata);
                  $("#profilepicture_preview").attr("width", profilepicture_width);
                  $("#profilepicture_preview").attr("height", profilepicture_height);
                  $("#profilepicture_retina").attr("src", retinaImageData);
                };

                $('#profilepicture_upload').Jcrop({
                  onChange: showPreview,
                  onSelect: showPreview,
                  setSelect:   [ 50, 50, profilepicture_width, profilepicture_height ],
                  aspectRatio: 1
                }, function(){
                  jcrop_api = this;
                  jcrop_api.setOptions({ allowResize: false });
                });

              });
            });
          };
        })(f);*/

        // Read in the image file as a data URL.

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
          return function(e) {
            var coverphoto_width = 300;
            var coverphoto_height = 300;
            var retina_width = 600;
            var retina_height = 600;
            $("#profilepicture_dropzone").hide();
            $("#profilepicture_upload").attr("src", e.target.result);
            $("#profilepicture_preview").attr("src", e.target.result);
            $("#profilepicture_upload").attr("title", escape(theFile.name));
            $("#profilepicture_upload").show();
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
              var img = $("#profilepicture_upload")[0]; // Get my img elem
              var pic_real_width, pic_real_height;
              $("<img/>") // Make in memory copy of image to avoid css issues
                  .attr("src", $(img).attr("src"))
                  .load(function() {
                      imagewidth = this.width;   // Note: $(this).width() will not
                      imageheight = this.height; // work for in memory images.
                      $('#profilepicture_upload').jrac({'crop_width': cropwidth, 'crop_height': cropheight, 'image_width': imagewidth, 'image_height': imageheight, 'viewport_width': imagewidth, 'viewport_height': imageheight, 'viewport_onload': function(){
                                        console.log('Viewport loaded.');
                                        $(".jrac_zoom_slider").hide();
                                        $(".ui-resizable-handle").hide();
                                           var $viewport = this;
                                           $viewport.observator.register('jrac_crop_x', $(document), function(element, event_name, value){
                                              cropx = value;
                                              console.log("x, y: ", cropx, cropy);
                                              mycontext.drawImage($("#profilepicture_upload")[0], cropx, cropy, cropwidth, cropheight, 0, 0, coverphoto_width, coverphoto_height);
                                              retinacontext.drawImage($("#profilepicture_upload")[0], cropx, cropy, cropwidth, cropheight, 0, 0, retina_width, retina_height);
                                              //var tempimagedata = tempcanvas.toDataURL();
                                              //$("#userprofilepicture_preview").attr("src", tempimagedata);
                                              //console.log($(".jrac_crop_drag_handler").position());
                                              var imagedata = mycanvas.toDataURL();
                                              var retinaImageData = retinacanvas.toDataURL();
                                              $("#profilepicture_preview").attr("src", imagedata);
                                              $("#profilepicture_preview").attr("width", coverphoto_width/2);
                                              $("#profilepicture_preview").attr("height", coverphoto_height/2);
                                              $("#profilepicture_retina").attr("src", retinaImageData);
                                            });
                                           $viewport.observator.register('jrac_crop_y', $(document), function(element, event_name, value){
                                              cropy = value;
                                              console.log("x, y: ", cropx, cropy);
                                              mycontext.drawImage($("#profilepicture_upload")[0], cropx, cropy, cropwidth, cropheight, 0, 0, coverphoto_width, coverphoto_height);
                                              //var tempimagedata = tempcanvas.toDataURL();
                                              //$("#userprofilepicture_preview").attr("src", tempimagedata);
                                              //console.log($(".jrac_crop_drag_handler").position());
                                              var imagedata = mycanvas.toDataURL();
                                              var retinaImageData = retinacanvas.toDataURL();
                                              $("#profilepicture_preview").attr("src", imagedata);
                                              $("#profilepicture_preview").attr("width", coverphoto_width/2);
                                              $("#profilepicture_preview").attr("height", coverphoto_height/2);
                                              $("#profilepicture_retina").attr("src", retinaImageData);
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
  },

  'change #profilefilesToUpload': function(evt){
    console.log(evt.target);

    var files = evt.target.files;

    //If more than one file dropped on the dropzone then throw an error to the user
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
            var profilepicture_width = 300;
            var profilepicture_height = 300;
            var retina_width = 600;
            var retina_height = 600;
            var cropx, cropy, cropwidth, cropheight, imagewidth, imageheight;
            cropwidth = 150;
            cropheight = 150;
            $("#profile_dropzone").hide();
            $("#profilefilesToUpload").hide();
            $("#profilepicture_upload").attr("src", e.target.result);
            $("#profilepicture_preview").attr("src", e.target.result);
            $("#profilepicture_upload").attr("title", escape(theFile.name));
            $("#profilepicture_upload").show();
            $(document).ready( function(){
              $(function(){
                function showPreview(){
                  var mycanvas = document.createElement('canvas');
                  var retinacanvas = document.createElement('canvas');
                  mycanvas.width = profilepicture_width;
                  mycanvas.height = profilepicture_height;
                  retinacanvas.width = retina_width;
                  retinacanvas.height = retina_height;
                  //console.log(coords);
                  console.log(cropx, cropy);
                  var mycontext = mycanvas.getContext('2d');
                  var retinacontext = retinacanvas.getContext('2d');
                  mycontext.drawImage($("#profilepicture_upload")[0], cropx, cropy, cropwidth, cropheight, 0, 0, profilepicture_width, profilepicture_height);
                  retinacontext.drawImage($("#profilepicture_upload")[0], cropx, cropy, cropwidth, cropheight, 0, 0, retina_width, retina_height);
                  var imagedata = mycanvas.toDataURL();
                  var retinaImageData = retinacanvas.toDataURL();
                  $("#profilepicture_preview").attr("src", imagedata);
                  $("#profilepicture_preview").attr("width", profilepicture_width);
                  $("#profilepicture_preview").attr("height", profilepicture_height);
                  $("#profilepicture_retina").attr("src", retinaImageData);
                };

                $("<img/>") // Make in memory copy of image to avoid css issues
                  .attr("src", $(img).attr("src"))
                  .load(function() {
                      imagewidth = this.width;   // Note: $(this).width() will not
                      imageheight = this.height; // work for in memory images.
                      $('#profileprofilepicture_upload').jrac({'crop_width': cropwidth, 'crop_height': cropheight, 'image_width': imagewidth, 'image_height': imageheight, 'viewport_width': imagewidth, 'viewport_height': imageheight, 'viewport_onload': function(){
                                        console.log('Viewport loaded.');
                                        $(".jrac_zoom_slider").hide();
                                        $(".ui-resizable-handle").hide();
                                           var $viewport = this;
                                           $viewport.observator.register('jrac_crop_x', $(document), function(element, event_name, value){
                                              cropx = value;
                                              showPreview();
                                            });
                                           $viewport.observator.register('jrac_crop_y', $(document), function(element, event_name, value){
                                              cropy = value;
                                              showPreview();
                                            });
                                      }
                      });
                  });
              });
              
            });
          }
        })(f);*/

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
          return function(e) {
            var coverphoto_width = 300;
            var coverphoto_height = 300;
            var retina_width = 600;
            var retina_height = 600;
            $("#profilepicture_dropzone").hide();
            $("#profilepicture_upload").attr("src", e.target.result);
            $("#profilepicture_preview").attr("src", e.target.result);
            $("#profilepicture_upload").attr("title", escape(theFile.name));
            $("#profilepicture_upload").show();
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
              var img = $("#profilepicture_upload")[0]; // Get my img elem
              var pic_real_width, pic_real_height;
              $("<img/>") // Make in memory copy of image to avoid css issues
                  .attr("src", $(img).attr("src"))
                  .load(function() {
                      imagewidth = this.width;   // Note: $(this).width() will not
                      imageheight = this.height; // work for in memory images.
                      $('#profilepicture_upload').jrac({'crop_width': cropwidth, 'crop_height': cropheight, 'image_width': imagewidth, 'image_height': imageheight, 'viewport_width': imagewidth, 'viewport_height': imageheight, 'viewport_onload': function(){
                                        console.log('Viewport loaded.');
                                        $(".jrac_zoom_slider").hide();
                                        $(".ui-resizable-handle").hide();
                                           var $viewport = this;
                                           $viewport.observator.register('jrac_crop_x', $(document), function(element, event_name, value){
                                              cropx = value;
                                              console.log("x, y: ", cropx, cropy);
                                              mycontext.drawImage($("#profilepicture_upload")[0], cropx, cropy, cropwidth, cropheight, 0, 0, coverphoto_width, coverphoto_height);
                                              retinacontext.drawImage($("#profilepicture_upload")[0], cropx, cropy, cropwidth, cropheight, 0, 0, retina_width, retina_height);
                                              //var tempimagedata = tempcanvas.toDataURL();
                                              //$("#userprofilepicture_preview").attr("src", tempimagedata);
                                              //console.log($(".jrac_crop_drag_handler").position());
                                              var imagedata = mycanvas.toDataURL();
                                              var retinaImageData = retinacanvas.toDataURL();
                                              $("#profilepicture_preview").attr("src", imagedata);
                                              $("#profilepicture_preview").attr("width", coverphoto_width/2);
                                              $("#profilepicture_preview").attr("height", coverphoto_height/2);
                                              $("#profilepicture_retina").attr("src", retinaImageData);
                                            });
                                           $viewport.observator.register('jrac_crop_y', $(document), function(element, event_name, value){
                                              cropy = value;
                                              console.log("x, y: ", cropx, cropy);
                                              mycontext.drawImage($("#profilepicture_upload")[0], cropx, cropy, cropwidth, cropheight, 0, 0, coverphoto_width, coverphoto_height);
                                              //var tempimagedata = tempcanvas.toDataURL();
                                              //$("#userprofilepicture_preview").attr("src", tempimagedata);
                                              //console.log($(".jrac_crop_drag_handler").position());
                                              var imagedata = mycanvas.toDataURL();
                                              var retinaImageData = retinacanvas.toDataURL();
                                              $("#profilepicture_preview").attr("src", imagedata);
                                              $("#profilepicture_preview").attr("width", coverphoto_width/2);
                                              $("#profilepicture_preview").attr("height", coverphoto_height/2);
                                              $("#profilepicture_retina").attr("src", retinaImageData);
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

  'click #club': function(evt){
    evt.stopPropagation();
    category = "club";
    $(".nav-tabs li").removeClass('active');
    $("#club").addClass('active');
  },

  'click #greek': function(evt){
    evt.stopPropagation();
    category = "greek";
    $(".nav-tabs li").removeClass('active');
    $("#greek").addClass('active');
  },

  'click #arts': function(evt){
    evt.stopPropagation();
    category = "arts";
    $(".nav-tabs li").removeClass('active');
    $("#arts").addClass('active');
  },

  'click #athletics': function(evt){
    evt.stopPropagation();
    category ="athletics";
    $(".nav-tabs li").removeClass('active');
    $("#athletics").addClass('active');
  },

  'click #academic': function(evt){
    evt.stopPropagation();
    category = "academic";
    $(".nav-tabs li").removeClass('active');
    $("#academic").addClass('active');
  },

  'click #administrative': function(evt){
    evt.stopPropagation();
    category   = "administrative";
    $(".nav-tabs li").removeClass('active');
    $("#administrative").addClass('active');
  },

  'click #community': function(evt){
    evt.stopPropagation();
    category = "community";
    $(".nav-tabs li").removeClass('active');
    $("#community").addClass('active');
  },

  'click #class': function(evt){
    evt.stopPropagation();
    category = "class";
    $(".nav-tabs li").removeClass('active');
    $("#class").addClass('active');
  },

  'click #residence': function(evt){
    evt.stopPropagation();
    category = "residence";
    $(".nav-tabs li").removeClass('active');
    $("#residence").addClass('active');
  },

  'click #custom': function(evt){
    evt.stopPropagation();
    category = "custom";
    $(".nav-tabs li").removeClass('active');
    $("#custom").addClass('active');
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

