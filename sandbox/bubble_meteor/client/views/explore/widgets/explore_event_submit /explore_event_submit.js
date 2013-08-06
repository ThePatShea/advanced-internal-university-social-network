Template.exploreEventSubmit.created = function () {
  this.validateForm = function() {
    var count = 0;

    $('.required').each(function(i) {
      if( !$(this).hasClass('wysiwyg') && $(this).val() === '' && $(this).attr("name") != undefined ) {
        count++;
      } else if ( $(this).hasClass('wysiwyg') && $(this).html().trim().replace("<br>","").replace('<span class="wysiwyg-placeholder">Type here...</span>','') == "" ) {
        count++;
      }

      if (count == 0) {
        $('#cb-form-container-discussion .cb-submit').prop('disabled', false);
        $('#cb-form-container-discussion .cb-submit').removeClass('ready-false');
      } else {
        $('#cb-form-container-discussion .cb-submit').prop('disabled', true);
        $('#cb-form-container-discussion .cb-submit').addClass('ready-false');
      }
    });
  }

 $("#eventphoto_retina").hide();
  $("#tempeventphoto").hide();

  $(".date-picker").glDatePicker(
    {
      cssName: 'flatwhite',
      allowMonthSelect: false,
      allowYearSelect: false
    }
  );

  //Format the time when the textbox is changed
  $("[name=time]").change(function(){
    var time = $("[name=time]").val();
    if (time) {
      var firstAlphabet  = parseInt(time[0]);

      if (time.length > 9 || (!firstAlphabet)){
        $("[name=time]").val("");
      }else{
        formatedTime = moment(time,"h:mm a").format("h:mm a");
        $("[name=time]").val(formatedTime);
      }

    }
  });
}

Template.discussionSubmit.rendered = function () {
  this.validateForm();
}

Template.eventSubmit.events({
  'submit form': function(event) {
    event.preventDefault();
    //Google Analytics
    _gaq.push(['_trackEvent', 'Post', 'Create Event', $(event.target).find('[name=name]').val()]);

    var dateTime = $(event.target).find('[name=date]').val() + " " + $(event.target).find('[name=time]').val();

    var eventAttributes = { 
      dateTime: moment(dateTime).valueOf(),
      location: $(event.target).find('[name=location]').val(),
      name: $(event.target).find('[name=name]').val(),
      body: $(event.target).find('[name=body]').val(),
      postType: 'event',
      bubbleId: Session.get('currentBubbleId'),
      attendees: [Meteor.userId()],
      eventPhoto: $(event.target).find('[id=eventphoto_preview]').attr('src'),
      retinaEventPhoto: $(event.target).find('[id=eventphoto_retina]').attr('src')
    };


    console.log("event attributes: " + JSON.stringify(eventAttributes) );
/*
    if(eventAttributes.eventPhoto.length == 0){
      var eventphotocanvas = document.createElement('canvas');
      var retinaeventphotocanvas = document.createElement('canvas');
      eventphotocanvas.width = 340;
      eventphotocanvas.height = 230;
      retinaeventphotocanvas.width = 680;
      retinaeventphotocanvas.height = 460;
      var eventphotocontext = eventphotocanvas.getContext('2d');
      var retinaeventphotocontext = retinaeventphotocanvas.getContext('2d');
      eventphotocontext.drawImage($('#tempeventphoto')[0], 0, 0, 340, 230, 0, 0, 340, 230);
      retinaeventphotocontext.drawImage($('#tempeventphoto')[0], 0, 0, 680, 460, 0, 0, 680, 460);
      eventAttributes.eventPhoto = eventphotocanvas.toDataURL();
      eventAttributes.retinaEventPhoto = retinaeventphotocanvas.toDataURL();
      console.log($('#tempeventphoto')[0]);
    }
*/    
    createPost(eventAttributes);
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
        reader.onload = (function(theFile) {
          return function(e) {
            var coverphoto_width = 340;
            var coverphoto_height = 230;
            var retina_width = 680;
            var retina_height = 460;
            $("#eventphoto_dropzone").hide();
            $("#eventfilesToUpload").hide();
            $("#eventphoto_upload").attr("src", e.target.result);
            $("#eventphoto_preview").attr("src", e.target.result);
            $("#eventphoto_upload").attr("title", escape(theFile.name));
            $("#eventphoto_upload").show();
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
                  mycontext.drawImage($("#eventphoto_upload")[0], coords.x, coords.y, (coords.x2 - coords.x), (coords.y2 - coords.y), 0, 0, coverphoto_width, coverphoto_height);
                  retinacontext.drawImage($("#eventphoto_upload")[0], coords.x, coords.y, (coords.x2 - coords.x), (coords.y2 - coords.y), 0, 0, retina_width, retina_height);
                  var imagedata = mycanvas.toDataURL();
                  var retinaImageData = retinacanvas.toDataURL();
                  $("#eventphoto_preview").attr("src", imagedata);
                  $("#eventphoto_preview").attr("width", coverphoto_width/2);
                  $("#eventphoto_preview").attr("height", coverphoto_height/2);
                  $("#eventphoto_retina").attr("src", retinaImageData);
                };

                $('#eventphoto_upload').Jcrop({
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


  'change #eventfilesToUpload': function(evt){
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
        reader.onload = (function(theFile) {
          return function(e) {
            var coverphoto_width = 340;
            var coverphoto_height = 230;
            var retina_width = 680;
            var retina_height = 460;
            $("#eventphoto_dropzone").hide();
            $("#eventfilesToUpload").hide();
            $("#eventphoto_upload").attr("src", e.target.result);
            $("#eventphoto_preview").attr("src", e.target.result);
            $("#eventphoto_upload").attr("title", escape(theFile.name));
            $("#eventphoto_upload").show();
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
                  mycontext.drawImage($("#eventphoto_upload")[0], coords.x, coords.y, (coords.x2 - coords.x), (coords.y2 - coords.y), 0, 0, coverphoto_width, coverphoto_height);
                  retinacontext.drawImage($("#eventphoto_upload")[0], coords.x, coords.y, (coords.x2 - coords.x), (coords.y2 - coords.y), 0, 0, retina_width, retina_height);
                  var imagedata = mycanvas.toDataURL();
                  var retinaImageData = retinacanvas.toDataURL();
                  $("#eventphoto_preview").attr("src", imagedata);
                  $("#eventphoto_preview").attr("width", coverphoto_width/2);
                  $("#eventphoto_preview").attr("height", coverphoto_height/2);
                  $("#eventphoto_retina").attr("src", retinaImageData);
                };

                $('#eventphoto_upload').Jcrop({
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

