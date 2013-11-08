Template.eventEdit.helpers({
  getDate: function(){
    return moment(this.dateTime).format("M/DD/YYYY");
  },
  getTime: function(){
    return moment(this.dateTime).format("hh:mm a");
  }

});

Template.eventEdit.events({
  'submit form': function(e) {
    e.preventDefault();
    //Google Analytics
    _gaq.push(['_trackEvent', 'Post', 'Edit Event', this.name]);

    var currentPostId = Session.get('currentPostId');
    var currentBubbleId = Session.get('currentBubbleId');


    var postProperties = {
      name: $(e.target).find('[name=name]').val(),
      body: $(e.target).find('[name=body]').val(),
      //dateTime: moment(dateTime).valueOf(),
      location: $(e.target).find('[name=location]').val(),
      eventPhoto: $(e.target).find('[id=eventphoto_preview]').attr('src'),
      retinaEventPhoto: $(e.target).find('[id=eventphoto_retina]').attr('src'),
      lastUpdated: new Date().getTime()
    };

    if($(event.target).find('[name=date]').val().length > 0 && $(event.target).find('[name=time]').val() > 0){
      var dateTime = $(event.target).find('[name=date]').val() + " " + $(event.target).find('[name=time]').val();
      postProperties.dateTime = dateTime;
    }


    Posts.update(currentPostId, {$set: postProperties}, function(error) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
      } else {
        createEditEventUpdate(Meteor.userId(), currentPostId);
        Meteor.Router.to('postPage', currentBubbleId, currentPostId);
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
            $("#eventphoto_preview").show();
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
            $("#eventphoto_preview").show();
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


  'click #delete_post': function(e) {
    e.preventDefault();
    //Google Analytics
    _gaq.push(['_trackEvent', 'Post', 'Delete Event', this.name]);
    if (confirm("Delete this post?")) {
      var currentPostId = Session.get('currentPostId');
      Posts.remove({_id: currentPostId});

      //Create update for members who are attending the event
      createDeleteEventUpdate(this);

      Meteor.Router.to('bubblePage',Session.get('currentBubbleId'));
    }
  }
});

Template.eventEdit.rendered = function() {

  $("#eventphoto_retina").hide();
  $("#eventfilesToUpload").hide();


  $(".date-picker").glDatePicker(
    {
      cssName: 'flatwhite',
      selectedDate: new Date($(".date-picker").val()),
      allowMonthSelect: false,
      allowYearSelect: false
    }
  );

  //Format the time when the textbox is changed
  $(".input-small").change(function(){
    var time = $(".input-small").val();
    if (time) {
      var firstAlphabet  = parseInt(time[0]);

      if (time.length > 9 || (!firstAlphabet)){
        $(".input-small").val("");
        $(".input-small").attr("placeholder","Time (ex: 9am)");
      }else{
        formatedTime = moment(time,"h:mm a").format("h:mm a");
        $(".input-small").val(formatedTime);
      }

    }
  });

  $("#change_eventphoto").click(function(){
    $("#eventphoto_preview").hide();
    $("#change_eventphoto").hide();
    $(".dropzone").show();
    $("#eventfilesToUpload").show();
  });
  var currentPostId = Session.get('currentPostId');
  var currentpost = Posts.findOne({_id: currentPostId});
  //user = Meteor.users.findOne({_id:Session.get('selectedUserId')});
  if(currentpost.eventPhoto.length == 0){
    //$(".userprofilepicture").attr("src", "/img/default_userprofile.png");
    $("#eventphoto_preview").attr("src", "/img/default_eventphoto.jpg");
    $(".dropzone").hide();
    //$(".dropzone").show();
  }
  else{
    $(".dropzone").hide();
  }

}
