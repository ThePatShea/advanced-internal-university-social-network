Template.userprofileEdit.helpers({
	getProfile: function() {
		//console.log('get profile: ', Meteor.users.findOne({_id:Session.get('selectedUserId')}));
		console.log(Meteor.user());
		return Meteor.users.findOne({_id:Session.get('selectedUserId')});
	},

	getEmail: function(){
		return this.emails[0].address;
	},

	hasPermission: function(){
		var profileId = Session.get('selectedUserId');
		//console.log(Meteor.user(), profileId);
		var user = Meteor.user();
		if(user._id == profileId){
			return true;
		}
		else{
			return false;
		}
	}

});


Template.userprofileEdit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var currentProfileId = Session.get('selectedUserId');
    //var dateTime = $(event.target).find('[name=date]').val() + " " + $(event.target).find('[name=time]').val();
    
    var profileProperties = {
	  profilePicture: $(e.target).find('[id=userprofilepicture_preview]').attr('src'),
      emails: [{'address': $(e.target).find('[name=email]').val(), 'verified': false}],
      phone: '666',
      lastUpdated: new Date().getTime()
    };
    console.log('Properties to be saved: ',profileProperties);
    
    Meteor.users.update(currentProfileId, {$set: profileProperties}, function(error) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
      } else {
        Meteor.Router.to('userProfile', currentProfileId);
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

    files = evt.dataTransfer.files;

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
            var coverphoto_width = 100;
            var coverphoto_height = 100;
            $("#userprofilepicture_dropzone").hide();
            $("#userprofilepicture_upload").attr("src", e.target.result);
            $("#userprofilepicture_preview").attr("src", e.target.result);
            $("#userprofilepicture_upload").attr("title", escape(theFile.name));
            $("#userprofilepicture_upload").show();
            $(document).ready( function(){
              $(function(){
                function showPreview(coords){
                  var mycanvas = document.createElement('canvas');
                  mycanvas.width = coverphoto_width;
                  mycanvas.height = coverphoto_height;
                  console.log(coords);
                  mycontext = mycanvas.getContext('2d');
                  mycontext.drawImage($("#userprofilepicture_upload")[0], coords.x, coords.y, (coords.x2 - coords.x), (coords.y2 - coords.y), 0, 0, coverphoto_width, coverphoto_height);
                  var imagedata = mycanvas.toDataURL();
                  $("#userprofilepicture_preview").attr("src", imagedata);
                  $("#userprofilepicture_preview").attr("width", coverphoto_width/2);
                  $("#userprofilepicture_preview").attr("height", coverphoto_height/2);
                };

                $('#userprofilepicture_upload').Jcrop({
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
  
});