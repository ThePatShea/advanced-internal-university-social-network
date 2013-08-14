Template.exploreEditEvent.rendered = function(){
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

Template.exploreEditEvent.events({
  'click .cb-explore-edit-event-form > .cb-submit-container > .cb-submit': function(event) {
    event.preventDefault();
    //Google Analytics
    _gaq.push(['_trackEvent', 'Post', 'Create Event', $(event.target).find('[name=name]').val()]);

    var dateTime = $(event.target).find('[name=date]').val() + " " + $(event.target).find('[name=time]').val();

    var eventAttributes = { 
      dateTime: moment(dateTime).valueOf(),
      location: $(event.target).find('[name=location]').val(),
      name: $(event.target).find('[name=name]').val(),
      body: $(event.target).find('[name=body]').val(),
      eventPhoto: $("#eventPhoto").attr("src"),
      retinaEventPhoto: $("#eventRetinaPhoto").attr("src")
    };


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
          var mainCanvas = document.getElementById('event-main-canvas');
          var retinaCanvas = document.getElementById('event-retina-canvas');
          var mainContext = mainCanvas.getContext('2d');
          var retinaContext = retinaCanvas.getContext('2d');
          var profileImage = new Image();

          // Closure to capture the file information.
          reader.onload = (function(theFile) {
            return function(e) {
                $(".cb-explore-edit-event-form .attach-files > .drop-zone").hide();
                $(".cb-explore-edit-event-form > .attach-files > .crop-container .crop").attr("src", e.target.result);
                profileImage.src = e.target.result;
                cropArea = $('.cb-explore-edit-event-form > .attach-files > .crop-container .crop').imgAreaSelect({instance: true, aspectRatio: '34:23', imageHeight: profileImage.height, imageWidth: profileImage.width, minWidth: '170', minHeight: '115', x1: '10', y1: '10', x2: '180', y2: '125', parent: "#add-picture", handles: true, onSelectChange: function(img, selection) {
                  mainContext.drawImage(profileImage, selection.x1, selection.y1, selection.width, selection.height, 0, 0, 340, 230);
                  retinaContext.drawImage(profileImage, selection.x1, selection.y1, selection.width, selection.height, 0, 0, 680, 460);
                  $("#eventPhoto").attr("src",mainCanvas.toDataURL());
                  $("#eventRetinaPhoto").attr("src",retinaCanvas.toDataURL());
                }});
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