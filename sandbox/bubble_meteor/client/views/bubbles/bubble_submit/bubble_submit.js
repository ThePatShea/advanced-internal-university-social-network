Template.bubbleSubmit.events({
  'submit form': function(event) {
    event.preventDefault();

    var bubble = {
      title: $(event.target).find('[name=title]').val(),
      description: $(event.target).find('[name=description]').val(),
      category: $(event.target).find('[name=category]').val(),
      coverPhoto: $(event.target).find('[id=coverphoto_preview]').attr('src'),
      profilePicture: $(event.target).find('[id=profilepicture_preview]').attr('src')
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

    files = evt.dataTransfer.files;
    if(files.length > 1){
      error = new Meteor.Error(422, 'Please choose only one image as the bubble image.');
      throwError(error.reason);
    }
    else{
      f = files[0];
      //If it is an image then render a thumbnail
      if (f.type.match('image.*')) {
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
          return function(e) {
            // Render thumbnail.
            /*dropzone = document.getElementById('drop_zone');
            parent = document.getElementById('bubble_image');
            parent.removeChild(dropzone);*/
            $("#cover_dropzone").hide();
            $("#coverphoto_upload").attr("src", e.target.result);
            $("#coverphoto_preview").attr("src", e.target.result);
            $("#coverphoto_upload").attr("title", escape(theFile.name));
            $("#coverphoto_upload").show();
            $(document).ready( function(){
              $(function(){
                //console.log($('#titleImage'));
                function showPreview(coords){
                  //var rx = 1000 / coords.w;
                  //var ry = 1000 / coords.h;
                  var mycanvas = document.createElement('canvas');
                  mycanvas.width = 500;
                  mycanvas.height = 250;
                  console.log(coords);
                  mycontext = mycanvas.getContext('2d');
                  mycontext.drawImage($("#coverphoto_upload")[0], coords.x, coords.y, (coords.x2 - coords.x), (coords.y2 - coords.y), 0, 0, 500, 250);
                  var imagedata = mycanvas.toDataURL();
                  $("#coverphoto_preview").attr("src", imagedata);
                };

                $('#coverphoto_upload').Jcrop({
                  onChange: showPreview,
                  onSelect: showPreview,
                  setSelect:   [ 50, 50, 500, 250 ],
                  aspectRatio: 500/250
                }, function(){
                  jcrop_api = this;
                  jcrop_api.setOptions({ allowResize: false });
                });

              });
            });
          };
        })(f);

        // Read in the image file as a data URL.
        reader.readAsDataURL(f);

      }

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

    files = evt.dataTransfer.files;
    if(files.length > 1){
      error = new Meteor.Error(422, 'Please choose only one image as the bubble image.');
      throwError(error.reason);
    }
    else{
      f = files[0];
      //If it is an image then render a thumbnail
      if (f.type.match('image.*')) {
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
          return function(e) {
            // Render thumbnail.
            /*dropzone = document.getElementById('drop_zone');
            parent = document.getElementById('bubble_image');
            parent.removeChild(dropzone);*/
            $("#profile_dropzone").hide();
            $("#profilepicture_upload").attr("src", e.target.result);
            $("#profilepicture_preview").attr("src", e.target.result);
            $("#profilepicture_upload").attr("title", escape(theFile.name));
            $("#profilepicture_upload").show();
            $(document).ready( function(){
              $(function(){
                //console.log($('#titleImage'));
                function showPreview(coords){
                  //var rx = 1000 / coords.w;
                  //var ry = 1000 / coords.h;
                  var mycanvas = document.createElement('canvas');
                  mycanvas.width = 300;
                  mycanvas.height = 300;
                  console.log(coords);
                  mycontext = mycanvas.getContext('2d');
                  mycontext.drawImage($("#profilepicture_upload")[0], coords.x, coords.y, (coords.x2 - coords.x), (coords.y2 - coords.y), 0, 0, 300, 300);
                  var imagedata = mycanvas.toDataURL();
                  $("#profilepicture_preview").attr("src", imagedata);
                };

                $('#profilepicture_upload').Jcrop({
                  onChange: showPreview,
                  onSelect: showPreview,
                  setSelect:   [ 50, 50, 300, 300 ],
                  aspectRatio: 1
                }, function(){
                  jcrop_api = this;
                  jcrop_api.setOptions({ allowResize: false });
                });

              });
            });
          };
        })(f);

        // Read in the image file as a data URL.
        reader.readAsDataURL(f);

      }

      else{
        error = new Meteor.Error(422, 'Please choose a valid image.');
        throwError(error.reason);
      }
    }


    
  },

});

Template.bubbleSubmit.rendered = function(){
};


