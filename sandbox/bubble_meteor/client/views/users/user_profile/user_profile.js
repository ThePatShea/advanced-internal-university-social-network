Template.userProfile.helpers({
	getUser: function() {
		return Meteor.users.findOne({_id:Session.get('selectedUserId')});
	},

	getUserId: function() {
		return Session.get('selectedUserId');
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
/*
	function preview(img, selection) {
	    var scaleX = 67 / (selection.width || 1);
	    var scaleY = 67 / (selection.height || 1);
	  
	  	$('.profile-pic-preview').attr('src','http://odyniec.net/projects/imgareaselect/ferret.jpg');
	    $('.profile-pic-preview').css({
	        width: Math.round(scaleX * img.width) + 'px',
	        height: Math.round(scaleY * img.height) + 'px',
	        marginLeft: '-' + Math.round(scaleX * selection.x1) + 'px',
	        marginTop: '-' + Math.round(scaleY * selection.y1) + 'px',
	        'max-width': 'none',
	        'border-radius': '0'
	    });
		console.log(Math.round(scaleX * img.width));
		console.log(Math.round(scaleY * img.height));
	};

	$('#crop').imgAreaSelect({aspectRatio: '1:1', minWidth: '67', minHeight: '67', x1: '10', y1: '10', x2: '160', y2: '160', onSelectChange: preview, handles: true });
*/
};

//Preview functionality for crop tool
function preview(img, selection) {
    var scaleX = 67 / (selection.width || 1);
    var scaleY = 67 / (selection.height || 1);
  
  	$('.profile-pic-preview').attr('src','http://odyniec.net/projects/imgareaselect/ferret.jpg');
    $('.profile-pic-preview').css({
        width: Math.round(scaleX * img.width) + 'px',
        height: Math.round(scaleY * img.height) + 'px',
        marginLeft: '-' + Math.round(scaleX * selection.x1) + 'px',
        marginTop: '-' + Math.round(scaleY * selection.y1) + 'px',
        'max-width': 'none',
        'border-radius': '0'
    });
	console.log(Math.round(scaleX * img.width));
	console.log(Math.round(scaleY * img.height));
};

Template.userProfile.events({
	'click .loadCropTool': function() {
		$('#crop').imgAreaSelect({aspectRatio: '1:1', minWidth: '67', minHeight: '67', x1: '10', y1: '10', x2: '160', y2: '160', onSelectChange: preview, handles: true });
	}
});