Template.editEvent.created = function(){
  this.validateForm = function() {
    var count = 0;

    $('#cb-form-container-edit-event .required').each(function(i) {
      if( !$(this).hasClass('wysiwyg') && $(this).val() === '' && $(this).attr("name") != undefined ) {
        count++;
      } else if ( $(this).hasClass('wysiwyg') && $(this).html().trim().replace("<br>","").replace('<span class="wysiwyg-placeholder">Type here...</span>','') == "" ) {
        count++;
      }


      if (count == 0) {
        $('#cb-form-container-edit-event .cb-submit').prop('disabled', false);
        $('#cb-form-container-edit-event .cb-submit').removeClass('ready-false');
      } else {
        $('#cb-form-container-edit-event .cb-submit').prop('disabled', true);
        $('#cb-form-container-edit-event .cb-submit').addClass('ready-false');
      }
    });
  }
}


Template.editEvent.rendered = function(){

  if($(window).width() < 768)
  {
    Session.set("DisableCrop","1");
  } else {
    Session.set("DisableCrop","");
  }

  this.validateForm();

	var event = this.data;
	var currentDatetime = new Date(event.dateTime);
	var time = currentDatetime.getHours()+":"+currentDatetime.getMinutes();
	var date = (currentDatetime.getMonth()+1)+"/"+currentDatetime.getDate()+"/"+currentDatetime.getFullYear();
	$("input[name='name']").val(event.name);
	$("input[name='location']").val(event.location);
	$("input[name='date']").val(date);
	$("input[name='body']").val(event.body);
	$("#eventPhoto").attr("src",this.eventPhoto);
	$("eventRetinaPhoto").attr("src",this.eventRetinaPhoto);
    if (time) {
      var firstAlphabet  = parseInt(time[0]);

      if (time.length > 9 || (!firstAlphabet)){
        $("[name=time]").val("");
      }else{
        formatedTime = moment(time,"h:mm a").format("h:mm a");
        $("[name=time]").val(formatedTime);
      }
    }

	$(".date-picker").glDatePicker(
    {
      cssName: 'flatwhite',
      allowMonthSelect: false,
      allowYearSelect: false
    });

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
};



Template.editEvent.events({
  'keyup .required, propertychange .required, input .required, paste .required': function(evt, tmpl) {
      tmpl.validateForm();
  }
});



Template.editEvent.events({
  'submit form': function(event) {
    event.preventDefault();
    //Google Analytics
    _gaq.push(['_trackEvent', 'Post', 'Create Event', $(event.target).find('[name=name]').val()]);

    var dateTime = $(event.target).find('[name=date]').val() + " " + $(event.target).find('[name=time]').val();

    var eventAttributes = { 
      dateTime: moment(dateTime).valueOf(),
      location: $(event.target).find('[name=location]').val(),
      name: encodeURIComponent($(event.target).find('[name=name]').val()),
      body: $(event.target).find('[name=body]').val()
    };

    if(typeof eventMainURL !== "undefined")
      eventAttributes.eventPhoto = eventMainURL;
    if(typeof eventRetinaURL !== "undefined")
      eventAttributes.retinaEventPhoto = eventRetinaURL;

    console.log("event attributes: " + JSON.stringify(eventAttributes) );
    
    var currentPostId = Session.get('currentPostId');
    var currentBubbleId = Session.get('currentBubbleId');
    Posts.update(currentPostId, {$set: eventAttributes}, function(error) {
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
                  eventCropArea = $('.crop-container > .crop').imgAreaSelect({instance: true, aspectRatio: '34:23', imageHeight: eventImage.height, imageWidth: eventImage.width, x1: '10', y1: '10', x2: (10+minX), y2: (10+minY), parent: "#add-picture", handles: true,
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