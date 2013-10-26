Template.exploreEventSubmit.created = function(){
  eventMainURL = "/img/Event.jpg";
  eventRetinaURL = "/img/Event.jpg";

  this.validateForm = function() {
    var count = 0;

    $('#cb-form-container-event .required').each(function(i) {
      if( !$(this).hasClass('wysiwyg') && $(this).val() === '' && $(this).attr("name") != undefined ) {
        count++;
      } else if ( $(this).hasClass('wysiwyg') && $(this).html().trim().replace("<br>","").replace('<span class="wysiwyg-placeholder">Type here...</span>','') == "" ) {
        count++;
      }


      if (count == 0) {
        $('#cb-form-container-event .cb-submit').prop('disabled', false);
        $('#cb-form-container-event .cb-submit').removeClass('ready-false');
      } else {
        $('#cb-form-container-event .cb-submit').prop('disabled', true);
        $('#cb-form-container-event .cb-submit').addClass('ready-false');
      }
    });
  }
}


Template.exploreEventSubmit.events({
  'keyup .required, propertychange .required, input .required, paste .required, click button': function(evt, tmpl) {
      tmpl.validateForm();
  }
});



Template.exploreEventSubmit.helpers({
  getCurrentUserId: function() {
    return Meteor.userId();
  },
  getAdminBubbles: function() {
    adminBubblesCount  =  Bubbles.find({"users.admins": Meteor.userId()}).count();
    adminBubbles       =  Bubbles.find({"users.admins": Meteor.userId()});
   
    if (adminBubblesCount > 0) {
      return adminBubbles;
    } else {
      return false;
    } 
  }
});



Template.exploreEventSubmit.events({
  'click .post-as-button': function(event) {
    event.preventDefault();
  },
  'click .cb-explore-eventSubmit-form > .cb-submit-container > .cb-submit': function(event) {
    event.preventDefault();
    //Google Analytics
    _gaq.push(['_trackEvent', 'Post', 'Create Event', $(event.target).find('[name=name]').val()]);

    var dateTime = $('.cb-explore-eventSubmit-form > .cb-form-row > .date').val() + " " + $('.cb-explore-eventSubmit-form > .cb-form-row > .time').val();
    //console.log('Event photo: ', $("#eventPhoto").attr("src"));

    var eventAttributes = { 
      dateTime: moment(dateTime).valueOf(),
      location: $('.cb-explore-eventSubmit-form > .first > .event-location').val(),
      name: encodeURIComponent($('.cb-explore-eventSubmit-form > .first > .event-name').val()),
      body: $('.cb-explore-eventSubmit-form > .event-details').val(),
      postAsType: $('.cb-explore-eventSubmit-form .post-as-type').val(),
      postAsId:   $('.cb-explore-eventSubmit-form .post-as-id').val(),
      postType: 'event',
      exploreId: Session.get('currentExploreId'),
      attendees: [Meteor.userId()],
      eventPhoto: eventMainURL,
      retinaEventPhoto: eventRetinaURL
    };


    //console.log("event attributes: ", eventAttributes );
    createPost(eventAttributes);

    //Show Post submitted confirmation message
    var postTitle = encodeURIComponent($('.cb-eventSubmit-form > .first > .event-name').val());
    var displayPostConfirmationMessage = function(postTitle){
      return function(){
        //postTitle = encodeURIComponent($('.cb-discussionSubmit-form').find('[name=name]').val());
        var message = postTitle.slice(0, 7);
        var message = message + ' ...';
        $('.message-container .info').text(message);
        $('.message-container').removeClass('visible-false');
        $('.message-container').addClass('message-container-active');
        setTimeout(function(){
          $('.message-container').removeClass('message-container-active');
          $('.message-container').addClass('visible-false');
          clearTimeout();
        },5000);
      }        
    }
    console.log('Post Title: ', postTitle);
    setTimeout(displayPostConfirmationMessage(postTitle), 1000);
    

  },

  'dragover .cb-explore-eventSubmit-form .attach-files > .drop-zone': function(evt){
    console.log('Dragover');
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
  },

  'change .cb-explore-eventSubmit-form .attach-files > .drop-zone > .file-chooser-invisible': function(evt){
      files = evt.target.files;
      //console.log('Event picture: ', files);
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
              $(".cb-explore-eventSubmit-form > .attach-files > .drop-zone").hide();
              $(".cb-explore-eventSubmit-form > .attach-files > .drop-zone > .file-chooser-invisible").width(1);
              $(".cb-explore-eventSubmit-form > .attach-files > .drop-zone > .file-chooser-invisible").height(1);
              $(".crop-container > .crop").attr("src", e.target.result).load(function() {
                eventImage.src = e.target.result;
                eventCropArea = $('.crop-container > .crop').imgAreaSelect({instance: true, aspectRatio: '34:23', imageHeight: eventImage.height, imageWidth: eventImage.width, x1: '10', y1: '10', x2: (10+minX), y2: (10+minY), parent: ".cb-explore-eventSubmit-form", handles: true,
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

Template.exploreEventSubmit.rendered = function() {

  if($(window).width() < 768)
  {
    Session.set("DisableCrop","1");
  } else {
    Session.set("DisableCrop","");
  }

  var postAsType = $("[name=post-as-type]").val();
  //$(".postAsButton." + postAsType).addClass("active-true");

  $(".post-as-button.bubble").mouseover(function() {
    $(".post-as-bubble-dropdown").show();
  });

  $(".post-as-button.bubble").mouseout(function() {
    $(".post-as-bubble-dropdown").hide();
  });

  $(".btn-select-post-as-bubble").click(function() {
    var postAsId = $(this).attr("name");
    $("[name=post-as-id]").val(postAsId);
    $("[name=post-as-type]").val("bubble");



    var bubbleTitle = $(this).children(".bubble-title").attr("name");
    $(".selected-bubble-post-as").html(bubbleTitle);

    $(".post-as-button.bubble").removeClass("active-false");
    $(".post-as-button.bubble").addClass("active-true");

    $(".post-as-button.me").removeClass("active-true");
    $(".post-as-button.me").addClass("active-false");

    $(".post-as-bubble-dropdown").hide();
  });


  $(".post-as-button.me").click(function() {
    $("[name=post-as-id]").val( Meteor.userId() );
    $("[name=post-as-type]").val("user");



    $(".post-as-button.bubble").removeClass("active-true");
    $(".post-as-button.bubble").addClass("active-false");

    $(".post-as-button.me").removeClass("active-false");
    $(".post-as-button.me").addClass("active-true");

    $(".selected-bubble-post-as").html("Select a bubble");
  });





  this.validateForm();

  $(".date-picker").glDatePicker(
    {
      cssName: 'flatwhite',
      allowMonthSelect: false,
      allowYearSelect: false
    }
  );

  //Format the time when the textbox is changed
  $('.cb-explore-eventSubmit-form > .cb-form-row > .time').change(function(){
    var time = $('.cb-explore-eventSubmit-form > .cb-form-row > .time').val();
    if (time) {
      var firstAlphabet  = parseInt(time[0]);

      if (time.length > 9 || (!firstAlphabet)){
        $('.cb-explore-eventSubmit-form > .cb-form-row > .time').val("");
      }else{
        formatedTime = moment(time,"h:mm a").format("h:mm a");
        $('.cb-explore-eventSubmit-form > .cb-form-row > .time').val(formatedTime);
      }

    }
  });

}
