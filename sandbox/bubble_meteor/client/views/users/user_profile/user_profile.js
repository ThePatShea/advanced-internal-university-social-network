Template.userProfile.helpers({
	getUser: function() {
		return Meteor.users.findOne({_id:Session.get('selectedUserId')});
	},

	getUserId: function() {
		return Session.get('selectedUserId');
	},

	hasLevel4Permission: function(){
    	return ('4' == Meteor.user().userType && this.userType != '4');
  	},

	getBubblesAdminList: function() {
		return Bubbles.find({'users.admins':this._id});
	},

	getBubblesMemberList: function() {
		return Bubbles.find({'users.members':this._id});
	},

	getBubbleAdminsCount: function() {
		var bubbles = Bubbles.find({'users.admins':this._id});
		return bubbles.count();
	},

	numBubbles: function() {
		var uid = Meteor.userId();
		var numBubbles = Bubbles.find({$or:
			[{'users.admins': {$in: [uid]}},
			{'users.members': {$in: [uid]}}
			]}).count();
		return numBubbles;
	},

	numAdmins: function() {
		var uid = Meteor.userId();
		var numBubbles = Bubbles.find({'users.admins': {$in: [uid]}}).count();
		return numBubbles;
	},

	numMembers: function() {
		var uid = Meteor.userId();
		var numBubbles = Bubbles.find({'users.members': {$in: [uid]}}).count();
		return numBubbles;
	},

	numPosts: function() {
		var uid = Meteor.userId();
		var numPosts = Posts.find({'userId': uid}).count();
		return numPosts;
	},

	getEmail: function() {
		return this.emails[0].address;
	},

	getProfilePicture: function(){
		var user = Meteor.users.findOne({_id:Session.get('selectedUserId')});
		return user.profilePicture;
	},
	hasPermission: function() {
		var profileId = Session.get('selectedUserId');
		//Checks if user is lvl 4 or if user is viewing own profile
		if('4' == Meteor.user().userType ||  Meteor.userId() == profileId) {
			return true;
		}
		else{
			return false;
		}
	},
	getUserType: function() {
		return Meteor.users.findOne({_id:Session.get('selectedUserId')}).userType;
	}
});

//Crop selection
Template.userProfile.rendered = function() {
	var cropArea;
	var mainURL;
	var retinaURL;
};

Template.userProfile.events({

	'click .loadCropTool': function() {
		cropArea = $('.crop').imgAreaSelect({instance: true, aspectRatio: '1:1', minWidth: '67', minHeight: '67', x1: '10', y1: '10', x2: '160', y2: '160', onSelectChange: preview, handles: true });
	},

	'click .removeCropTool': function() {
		cropArea.cancelSelection();
		//$(".crop").hide();
		//$("#drop_zone").show();
	},

	'submit form': function(e) {
    	e.preventDefault();

	    var currentProfileId = Session.get('selectedUserId');
	    //var dateTime = $(event.target).find('[name=date]').val() + " " + $(event.target).find('[name=time]').val();
	    
	    var profileProperties = {
	      profilePicture: mainURL,
	      retinaProfilePicture: retinaURL,
	      emails: [{'address': $(e.target).find('[name=email]').val(), 'verified': false}],
	      phone: '',
	      lastUpdated: new Date().getTime(),
	      userType: $(e.target).find('[name=userType]').val()
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

	'change #filesToUpload': function(evt){
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

				var mainCanvas = document.getElementById('main-canvas');
				var retinaCanvas = document.getElementById('retina-canvas');
				var mainContext = mainCanvas.getContext('2d');
				var retinaContext = retinaCanvas.getContext('2d');
				var profileImage = new Image();

		        // Closure to capture the file information.
		        reader.onload = (function(theFile) {
		        	return function(e) {
		            	$("#drop_zone").hide();
		            	$(".crop").attr("src", e.target.result);
		            	profileImage.src = e.target.result;
	            		cropArea = $('.crop').imgAreaSelect({instance: true, aspectRatio: '1:1', imageHeight: profileImage.height, imageWidth: profileImage.width, minWidth: '67', minHeight: '67', x1: '10', y1: '10', x2: '77', y2: '77', parent: ".cb-form-container", handles: true, onSelectChange: function(img, selection) {
						    mainContext.drawImage(profileImage, selection.x1, selection.y1, selection.width, selection.height, 0, 0, 160, 160);
						    retinaContext.drawImage(profileImage, selection.x1, selection.y1, selection.width, selection.height, 0, 0, 320, 320);
						    mainURL = mainCanvas.toDataURL();
						    retinaURL = retinaCanvas.toDataURL();
						    $(".profile-pic-preview").attr("src",mainURL);
	            		}});
		        	};
		        })(f);
		        reader.readAsDataURL(f);
		    }
    	}
	}
});

//Preview functionality for crop tool
function preview(img, selection) {
    var scaleX = 67 / (selection.width || 1);
    var scaleY = 67 / (selection.height || 1);
  /*
    $('.profile-pic-preview').css({
        width: Math.round(scaleX * img.width) + 'px',
        height: Math.round(scaleY * img.height) + 'px',
        marginLeft: '-' + Math.round(scaleX * selection.x1) + 'px',
        marginTop: '-' + Math.round(scaleY * selection.y1) + 'px',
        'max-width': 'none',
        'border-radius': '0'
    });*/
	console.log(Math.round(scaleX * img.width));
	console.log(Math.round(scaleY * img.height));
};