Template.eventSubmit.events({
  'submit form': function(event) {
    event.preventDefault();
    //Google Analytics
    _gaq.push(['_trackEvent', 'Post', 'Create Event', $(event.target).find('[name=name]').val()]);

    alert('SUBMIT!');

    var dateTime = $(event.target).find('[name=date]').val() + " " + $(event.target).find('[name=time]').val();

    var eventAttributes = { 
      dateTime: moment(dateTime).valueOf(),
      location: $(event.target).find('[name=location]').val(),
      name: $(event.target).find('[name=name]').val(),
      body: $(event.target).find('[name=body]').val(),
      postType: 'event',
      bubbleId: Session.get('currentBubbleId'),
      attendees: [Meteor.userId()],
      eventPhoto: mainURL,
      retinaEventPhoto: retinaURL
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

  'change #eventFilesToUpload': function(evt){
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

        var mainCanvas = document.getElementById('event-main-canvas');
        var retinaCanvas = document.getElementById('event-retina-canvas');
        var mainContext = mainCanvas.getContext('2d');
        var retinaContext = retinaCanvas.getContext('2d');
        var profileImage = new Image();
        var mainURL = "/img/Event.jpg";
        var retinaURL = "/img/Event.jpg";

            // Closure to capture the file information.
            reader.onload = (function(theFile) {
              return function(e) {
                  $("#event_drop_zone").hide();
                  $(".crop").attr("src", e.target.result);
                  profileImage.src = e.target.result;
                  cropArea = $('.crop').imgAreaSelect({instance: true, aspectRatio: '34:23', imageHeight: profileImage.height, imageWidth: profileImage.width, minWidth: '170', minHeight: '115', x1: '10', y1: '10', x2: '180', y2: '125', parent: "#add-picture", handles: true, onSelectChange: function(img, selection) {
                    mainContext.drawImage(profileImage, selection.x1, selection.y1, selection.width, selection.height, 0, 0, 160, 160);
                    retinaContext.drawImage(profileImage, selection.x1, selection.y1, selection.width, selection.height, 0, 0, 320, 320);
                    mainURL = mainCanvas.toDataURL();
                    retinaURL = retinaCanvas.toDataURL();
                  }});
              };
            })(f);
            reader.readAsDataURL(f);
        }
      }
  }

});

Template.eventSubmit.rendered = function() {
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
