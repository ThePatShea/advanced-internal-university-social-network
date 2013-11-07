Template.exploreEditEvent.helpers({
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


Template.exploreEditEvent.created = function(){
  console.log("EXPLORE EDIT EVENT!!!!!!!!!!!!!!!!!!!!!!!", this);
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



Template.exploreEditEvent.rendered = function(){
  this.validateForm();

	var event = this.data;
  console.log("event: ",event);
	var currentDatetime = new Date(event.dateTime);
	var time = currentDatetime.getHours()+":"+currentDatetime.getMinutes();
	var date = (currentDatetime.getMonth()+1)+"/"+currentDatetime.getDate()+"/"+currentDatetime.getFullYear();
	$('.cb-explore-edit-event-form > .first > .title').val(decodeURIComponent(event.name));
	$('.cb-explore-edit-event-form > .first > .location').val(event.location);
	$('.cb-explore-edit-event-form > .cb-form-row > .date').val(date);
	$('.cb-explore-edit-event-form > .body').val(event.body);
	$("#eventPhoto").attr("src",this.eventPhoto);
	$("eventRetinaPhoto").attr("src",this.eventRetinaPhoto);
  editEventMainURL = this.eventPhoto;
  editEventRetinaURL = this.eventRetinaPhoto;
  if (time) {
    var firstAlphabet  = parseInt(time[0]);

    if (time.length > 9 || (!firstAlphabet)){
      $('.cb-explore-edit-event-form > .cb-form-row > .time').val("");
    }else{
      formatedTime = moment(time,"h:mm a").format("h:mm a");
      $('.cb-explore-edit-event-form > .cb-form-row > .time').val(formatedTime);
    }
  }
  if(event.postAsType == "user")
  {
    $("[name=post-as-id]").val(event.postAsId);
    $("[name=post-as-type]").val("user");
    $(".post-as-button.me").addClass("active-true");
  }
  else if(event.postAsType == "bubble")
  {
    $("[name=post-as-id").val(event.postAsId);
    $("[name=post-as-type").val("bubble")
    $(".post-as-button.bubble").addClass("active-true");
    $(".selected-bubble-post-as").html($("[name="+event.postAsId+"] > .bubble-title").attr("name"));
  }



	$(".date-picker").glDatePicker(
    {
      cssName: 'flatwhite',
      allowMonthSelect: false,
      allowYearSelect: false
    });

  //Format the time when the textbox is changed
  $(".cb-explore-edit-event-form > .cb-form-row > .time").change(function(){
    console.log('Time changing...');
    var time = $(".cb-explore-edit-event-form > .cb-form-row > .time").val();
    if (time) {
      var firstAlphabet  = parseInt(time[0]);

      if (time.length > 9 || (!firstAlphabet)){
        $(".cb-explore-edit-event-form > .cb-form-row > .time").val("");
      }else{
        formatedTime = moment(time,"h:mm a").format("h:mm a");
        console.log('Formatted time: ', formatedTime);
        $(".cb-explore-edit-event-form > .cb-form-row > .time").val(formatedTime);
      }

    }
  });
};


Template.exploreEditEvent.events({
  'click .post-as-button': function(event) {
    event.preventDefault();
  },
  'keyup .required, propertychange .required, input .required, paste .required, click button': function(evt, tmpl) {
      tmpl.validateForm();
  },
  'click .post-as-button.bubble': function(){
    if($(".post-as-bubble-dropdown").css('display') == 'none')
    {
      $(".post-as-bubble-dropdown").show();
    }
    else
    {
      $(".post-as-bubble-dropdown").hide();
    }
  },
  'click .btn-select-post-as-bubble': function(evt,tmpl){
    //var postAsId = $(this).attr("title");
    var postAsId = this._id;
    console.log("(EDIT)Post As Id: ", this);
    $("[name=post-as-id]").val(postAsId);
    $("[name=post-as-type]").val("bubble");



    //var bubbleTitle = $(this).children(".bubble-title").attr("name");
    var bubbleTitle = this.title;
    $(".selected-bubble-post-as").html(bubbleTitle);

    $(".post-as-button.bubble").removeClass("active-false");
    $(".post-as-button.bubble").addClass("active-true");

    $(".post-as-button.me").removeClass("active-true");
    $(".post-as-button.me").addClass("active-false");

    $(".post-as-bubble-dropdown").hide();
    tmpl.validateForm();
  },
  'click .post-as-button.me': function(evt,tmpl){
    $("[name=post-as-id]").val( Meteor.userId() );
    $("[name=post-as-type]").val("user");



    $(".post-as-button.bubble").removeClass("active-true");
    $(".post-as-button.bubble").addClass("active-false");

    $(".post-as-button.me").removeClass("active-false");
    $(".post-as-button.me").addClass("active-true");

    $(".selected-bubble-post-as").html("Select a bubble");
    tmpl.validateForm();
  },
  'click .cb-explore-edit-event-form > .cb-submit-container > .cb-submit': function(event) {
    event.preventDefault();
    //Google Analytics
    //_gaq.push(['_trackEvent', 'Post', 'Create Event', $(event.target).find('[name=name]').val()]);

    var dateTime = $('.cb-explore-edit-event-form > .cb-form-row > .date').val() + " " + $('.cb-explore-edit-event-form > .cb-form-row > .time').val();

  

    var eventAttributes = { 
      //author: Meteor.userId(),
      dateTime: moment(dateTime).valueOf(),
      location: $('.cb-explore-edit-event-form > .first > .location').val(),
      name: encodeURIComponent($('.cb-explore-edit-event-form > .first > .title').val()),
      body: $('.cb-explore-edit-event-form > .body').val(),
      //postAsType: $('.cb-explore-edit-event-form .post-as-type').val(),
      //postAsId:   $('.cb-explore-edit-event-form .post-as-id').val(),
   //   eventPhoto: editEventMainURL,
   //   retinaEventPhoto: editEventRetinaURL
    };

    //WORK AROUND FOR POSTASTYPE = 'POSTASTYPE' BUG
    if($('.cb-explore-edit-event-form .post-as-type').val() !== 'postAsType')
    {
      eventAttributes.postAsType = $('.cb-explore-edit-event-form .post-as-type').val();
    };
    if($('.cb-explore-edit-event-form .post-as-id').val() !== 'postAsId')
    {
      eventAttributes.postAsId = $('.cb-explore-edit-event-form .post-as-id').val();
    };

    console.log(eventAttributes);


    /*if($('#eventPhoto').attr('src') != '/img/Event.jpg'){
      eventAttributes.eventPhoto = $("#eventPhoto").attr("src");
      eventAttributes.retinaEventPhoto = $("#eventRetinaPhoto").attr("src");
    }*/


    console.log("event attributes: " + JSON.stringify(eventAttributes) );
    
    var currentPostId = Session.get('currentPostId');
    var currentExploreId = Session.get('currentExploreId');
    Posts.update(currentPostId, {$set: eventAttributes}, function(error) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
      } else {
        createEditEventUpdate(Meteor.userId(), currentPostId);
        Meteor.Router.to('explorePostPage', currentExploreId, currentPostId);
      }
    });

    var displayPostConfirmationMessage = function(){
      return function(){
        $('.job-type').text("These edits will be applied shortly!");
        $('.message-container').removeClass('visible-false');
        $('.message-container').addClass('message-container-active');
        setTimeout(function(){
          $('.message-container').removeClass('message-container-active');
          $('.message-container').addClass('visible-false');
          clearTimeout();
        },10000);
      }        
    }
    setTimeout(displayPostConfirmationMessage(), 1000);
  },

  'dragover .cb-explore-edit-event-form > .attach-files > .drop-zone': function(evt){
    console.log('Dragover');
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
  },

  'change .cb-explore-edit-event-form .attach-files > .drop-zone > .file-chooser-invisible': function(evt){
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
          var editEventMainCanvas = document.getElementById('edit-event-main-canvas');
          var editEventRetinaCanvas = document.getElementById('edit-event-retina-canvas');
          var editEventMainContext = editEventMainCanvas.getContext('2d');
          var editEventRetinaContext = editEventRetinaCanvas.getContext('2d');
          var editEventImage = new Image();
          var minX = 68;
          var minY = 46;

          // Closure to capture the file information.
          reader.onload = (function(theFile) {
            return function(e) {
              $("#cb-form-container-edit-event > .cb-form > .attach-files > .drop-zone").hide();
              $("#cb-form-container-edit-event > .cb-form > .attach-files > .drop-zone > .file-chooser-invisible").width(1);
              $("#cb-form-container-edit-event > .cb-form > .attach-files > .drop-zone > .file-chooser-invisible").height(1);
              $(".edit-crop-container > .crop").attr("src", e.target.result).load(function() {
                editEventImage.src = e.target.result;
                editEventCropArea = $('.edit-crop-container > .crop').imgAreaSelect({instance: true, aspectRatio: '34:23', imageHeight: editEventImage.height, imageWidth: editEventImage.width, x1: '10', y1: '10', x2: (10+minX), y2: (10+minY), parent: "#cb-form-container-edit-event > .cb-form", handles: true,
                  onInit: function(img, selection) {
                    editEventMainContext.drawImage(editEventImage, selection.x1, selection.y1, selection.width, selection.height, 0, 0, 340, 230);
                    editEventRetinaContext.drawImage(editEventImage, selection.x1, selection.y1, selection.width, selection.height, 0, 0, 680, 460);
                    editEventMainURL = editEventMainCanvas.toDataURL();
                    editEventRetinaURL = editEventRetinaCanvas.toDataURL();
                    if(Session.get("DisableCrop") == "1")
                    {
                      if((editEventImage.width/editEventImage.height) <= (34/23))
                      {
                        x1 = 0;
                        y1 = 0;
                        width = editEventImage.width;
                        height = editEventImage.width * (23/34);
                      }
                      else
                      {
                        y1 = 0;
                        x1 = 0;
                        height = editEventImage.height;
                        width = editEventImage.height * (34/23);
                      }
                      editEventMainContext.drawImage(editEventImage, x1, y1, width, height, 0, 0, 340, 230);
                      editEventRetinaContext.drawImage(editEventImage, x1, y1, width, height, 0, 0, 680, 460);
                      editEventMainURL = editEventMainCanvas.toDataURL();
                      editEventRetinaURL = editEventRetinaCanvas.toDataURL();
                      editEventCropArea.cancelSelection();
                    }
                  }, onSelectChange: function(img, selection) {
                    if(selection.width != 0)
                    {
                      editEventMainContext.drawImage(editEventImage, selection.x1, selection.y1, selection.width, selection.height, 0, 0, 340, 230);
                      console.log(selection.y1);
                      editEventRetinaContext.drawImage(editEventImage, selection.x1, selection.y1, selection.width, selection.height, 0, 0, 680, 460);
                      editEventMainURL = editEventMainCanvas.toDataURL();
                      editEventRetinaURL = editEventRetinaCanvas.toDataURL();
                    }
                    else
                    {
                      editEventCropArea.setSelection(10,10, (10+minX),(10+minY));
                      editEventCropArea.setOptions({show: true});
                      editEventCropArea.update();
                    }
                    //console.log(selection.x1+" "+selection.y1+" "+selection.width+" "+selection.height);
                  }, onSelectEnd: function(img, selection){
                    if((selection.width < minX) || (selection.height < minY))
                    {
                      if((selection.x1 > eventImage.width-minX) || (selection.y1 > eventImage.height-minY))
                      {
                        if(selection.x1 < minX)
                        {
                          editEventCropArea.setSelection(0,selection.y2-minY,minX,selection.y2);
                          editEventCropArea.update();
                        }
                        else if(selection.y1 < minY)
                        {
                          editEventCropArea.setSelection(selection.x2-minX,0,selection.x2,minY);
                          editEventCropArea.update();
                        }
                        else
                        {
                          editEventCropArea.setSelection(selection.x2-minX,selection.y2-minY,selection.x2,selection.y2);
                          editEventCropArea.update();
                        }
                      }
                      else
                      {
                        editEventCropArea.setSelection(selection.x1,selection.y1,selection.x1+minX,selection.y1+minY);
                        editEventCropArea.update();
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
