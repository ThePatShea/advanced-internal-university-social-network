Template.eventSubmit.created = function(){
  eventMainURL = "/img/Event.jpg";
  eventRetinaURL = "/img/Event.jpg";
  var mto = "";
  this.validateForm = function() {
    var count = 0;

    $('#cb-form-container-event-create .required').each(function(i) {
      if( !$(this).hasClass('wysiwyg') && $(this).val() === '' && $(this).attr("name") != undefined ) {
        count++;
      } else if ( $(this).hasClass('wysiwyg') && $(this).html().trim().replace("<br>","").replace('<span class="wysiwyg-placeholder">Type here...</span>','') == "" ) {
        count++;
      }


      if (count == 0) {
        $('#cb-form-container-event-create .cb-submit').prop('disabled', false);
        $('#cb-form-container-event-create .cb-submit').removeClass('ready-false');
      } else {
        $('#cb-form-container-event-create .cb-submit').prop('disabled', true);
        $('#cb-form-container-event-create .cb-submit').addClass('ready-false');
      }
    });
  }
}

Template.eventSubmit.events({
  'click .cb-eventSubmit-form > .cb-submit-container > .cb-submit': function(event) {
    event.preventDefault();
    //Google Analytics
    _gaq.push(['_trackEvent', 'Post', 'Create Event', $(event.target).find('[name=name]').val()]);

    var dateTime = $("#cb-form-container-event-create .date").val() + " " + $("#cb-form-container-event-create .time").val();
    console.log('Event photo: ', eventMainURL);

    var eventAttributes = { 
      dateTime: moment(dateTime).valueOf(),
      location: $('.cb-eventSubmit-form > .first > .event-location').val(),
      name: encodeURIComponent($('.cb-eventSubmit-form > .first > .event-name').val()),
      body: $('.cb-eventSubmit-form > .event-details').val(),
      postType: 'event',
      bubbleId: Session.get('currentBubbleId'),
      attendees: [Meteor.userId()],
      eventPhoto: eventMainURL,
      retinaEventPhoto: eventRetinaURL
    };


    console.log("event attributes: ", eventAttributes );
    createPost(eventAttributes);

    $('#form-loader').show();
  },

  'dragover .cb-eventSubmit-form .attach-files > .drop-zone': function(evt){
    console.log('Dragover');
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
  },

  'change .cb-eventSubmit-form .attach-files > .drop-zone > .file-chooser-invisible': function(evt){
    files = evt.target.files;
    console.log('Event picture: ', files);
    //If more than one file dropped on the dropzone then throw an error to the user.
    if(files.length > 1){
      error = new Meteor.Error(422, 'Please choose only one image as the event image.');
      throwError(error.reason);
    }
    else{
      f = files[0];
      //If the file dropped on the dropzone is an image then start processing it
      if (f.type.match('image.*')) {
        var reader = new FileReader();
        var eventMainCanvas = document.getElementById('event-main-canvas');
        var eventRetinaCanvas = document.getElementById('event-retina-canvas');
        var eventMainContext = eventMainCanvas.getContext('2d');
        var eventRetinaContext = eventRetinaCanvas.getContext('2d');
        var eventImage = new Image();
        var minX = 68;
        var minY = 46;

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
          return function(e) {
            $(".attach-files > .drop-zone").hide();
            $(".attach-files > .drop-zone > .file-chooser-invisible").width(1);
            $(".attach-files > .drop-zone > .file-chooser-invisible").height(1);
            $(".crop-container > .crop").attr("src", e.target.result).load(function() {
              eventImage.src = e.target.result;
              eventCropArea = $('.crop-container > .crop').imgAreaSelect({instance: true, aspectRatio: '34:23', imageHeight: eventImage.height, imageWidth: eventImage.width, x1: '10', y1: '10', x2: (10+minX), y2: (10+minY), parent: ".cb-eventSubmit-form", handles: true,
                onInit: function(img, selection) {
                  eventMainContext.drawImage(eventImage, selection.x1, selection.y1, selection.width, selection.height, 0, 0, 340, 230);
                  eventRetinaContext.drawImage(eventImage, selection.x1, selection.y1, selection.width, selection.height, 0, 0, 680, 460);
                  eventMainURL = eventMainCanvas.toDataURL();
                  eventRetinaURL = eventRetinaCanvas.toDataURL();
                  if(Session.get("DisableCrop") == "1")
                  {
                    if((eventImage.width/eventImage.height) <= (34/23))
                    {
                      x1 = 0;
                      y1 = 0;
                      width = eventImage.width;
                      height = eventImage.width * (23/34);
                    }
                    else
                    {
                      y1 = 0;
                      x1 = 0;
                      height = eventImage.height;
                      width = eventImage.height * (34/23);
                    }
                    eventMainContext.drawImage(eventImage, x1, y1, width, height, 0, 0, 340, 230);
                    eventRetinaContext.drawImage(eventImage, x1, y1, width, height, 0, 0, 680, 460);
                    eventMainURL = eventMainCanvas.toDataURL();
                    eventRetinaURL = eventRetinaCanvas.toDataURL();
                    eventCropArea.cancelSelection();
                  }
                }, onSelectChange: function(img, selection) {
                  if(selection.width != 0)
                  {
                    eventMainContext.drawImage(eventImage, selection.x1, selection.y1, selection.width, selection.height, 0, 0, 340, 230);
                    console.log(selection.y1);
                    eventRetinaContext.drawImage(eventImage, selection.x1, selection.y1, selection.width, selection.height, 0, 0, 680, 460);
                    eventMainURL = eventMainCanvas.toDataURL();
                    eventRetinaURL = eventRetinaCanvas.toDataURL();
                  }
                  else
                  {
                    eventCropArea.setSelection(10,10, (10+minX),(10+minY));
                    eventCropArea.setOptions({show: true});
                    eventCropArea.update();
                  }
                  //console.log(selection.x1+" "+selection.y1+" "+selection.width+" "+selection.height);
                }, onSelectEnd: function(img, selection){
                  if((selection.width < minX) || (selection.height < minY))
                  {
                    if((selection.x1 > eventImage.width-minX) || (selection.y1 > eventImage.height-minY))
                    {
                      if(selection.x1 < minX)
                      {
                        eventCropArea.setSelection(0,selection.y2-minY,minX,selection.y2);
                        eventCropArea.update();
                      }
                      else if(selection.y1 < minY)
                      {
                        eventCropArea.setSelection(selection.x2-minX,0,selection.x2,minY);
                        eventCropArea.update();
                      }
                      else
                      {
                        eventCropArea.setSelection(selection.x2-minX,selection.y2-minY,selection.x2,selection.y2);
                        eventCropArea.update();
                      }
                    }
                    else
                    {
                      eventCropArea.setSelection(selection.x1,selection.y1,selection.x1+minX,selection.y1+minY);
                      eventCropArea.update();
                    }
                  }
                }
              });
            });
          };
        })(f);
        reader.readAsDataURL(f);
      }
      else{
        error = new Meteor.Error(422, 'Please choose a valid image.');
        throwError(error.reason);
      }
    }
  }
});



Template.eventSubmit.events({
  'keyup .required, propertychange .required, input .required, paste .required': function(evt, tmpl) {
      tmpl.validateForm();
  }
});



Template.eventSubmit.rendered = function() {
  
  this.validateForm();

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

  if($(window).width() < 768)
  {
    Session.set("DisableCrop","1");
  } else {
    Session.set("DisableCrop","");
  }


  //Log clicking of name textbox
  $(".event-name").on("click", function() {
    Meteor.clearTimeout(mto);
    mto = Meteor.setTimeout(function() {
      //Logs the action that user is doing
      Meteor.call('createLog', 
        { action: 'click-eventNameTextbox',
          overwritePage: 'create-event' }, 
        window.location.pathname, 
        function(error) { if(error) { throwError(error.reason); }
      });
    }, 500);
  });

  //Log clicking of location textbox
  $(".event-location").on("click", function() {
    Meteor.clearTimeout(mto);
    mto = Meteor.setTimeout(function() {
      //Logs the action that user is doing
      Meteor.call('createLog', 
        { action: 'click-eventLocationTextbox',
          overwritePage: 'create-event' }, 
        window.location.pathname, 
        function(error) { if(error) { throwError(error.reason); }
      });
    }, 500);
  });

  //Log clicking of date 
  $(".date").on("click", function() {
    Meteor.clearTimeout(mto);
    mto = Meteor.setTimeout(function() {
      //Logs the action that user is doing
      Meteor.call('createLog', 
        { action: 'click-eventDateTextbox',
          overwritePage: 'create-event' }, 
        window.location.pathname, 
        function(error) { if(error) { throwError(error.reason); }
      });
    }, 500);
  });

  //Log clicking of time 
  $(".time").on("click", function() {
    Meteor.clearTimeout(mto);
    mto = Meteor.setTimeout(function() {
      //Logs the action that user is doing
      Meteor.call('createLog', 
        { action: 'click-eventTimeTextbox',
          overwritePage: 'create-event' }, 
        window.location.pathname, 
        function(error) { if(error) { throwError(error.reason); }
      });
    }, 500);
  });

  //Log clicking of picture 
  $(".event-picture").on("click", function() {
    Meteor.clearTimeout(mto);
    mto = Meteor.setTimeout(function() {
      //Logs the action that user is doing
      Meteor.call('createLog', 
        { action: 'click-eventAttachPicture',
          overwritePage: 'create-event' }, 
        window.location.pathname, 
        function(error) { if(error) { throwError(error.reason); }
      });
    }, 500);
  });

  //Log clicking of details 
  $(".event-details").on("click", function() {
    Meteor.clearTimeout(mto);
    mto = Meteor.setTimeout(function() {
      //Logs the action that user is doing
      Meteor.call('createLog', 
        { action: 'click-eventDetailsTextbox',
          overwritePage: 'create-event' }, 
        window.location.pathname, 
        function(error) { if(error) { throwError(error.reason); }
      });
    }, 500);
  });

  //Log clicking of submit button
  $(".words-main").on("click", function() {
    Meteor.clearTimeout(mto);
    mto = Meteor.setTimeout(function() {
      //Logs the action that user is doing
      Meteor.call('createLog', 
        { action: 'click-eventSubmitButton',
          overwritePage: 'create-event' }, 
        window.location.pathname, 
        function(error) { if(error) { throwError(error.reason); }
      });
    }, 500);
  });

  //Log clicking of submit error button
  $(".words-error").on("click", function() {
    Meteor.clearTimeout(mto);
    mto = Meteor.setTimeout(function() {
      //Logs the action that user is doing
      Meteor.call('createLog', 
        { action: 'click-eventErrorSubmitButton',
          overwritePage: 'create-event' }, 
        window.location.pathname, 
        function(error) { if(error) { throwError(error.reason); }
      });
    }, 500);
  });

}
