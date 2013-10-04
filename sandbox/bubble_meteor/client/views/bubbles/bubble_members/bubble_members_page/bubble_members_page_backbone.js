Template.bubbleMembersPageBB.created = function() {
	virtualPage = 0;
	max_scrolltop = 200;
	Session.set("isLoading", true);
	
	if(typeof mybubbles === "undefined")
	{
		mybubbles = new BubbleData.MyBubbles({
		    bubbleId: currentBubbleId,
		    limit: 10,
		    fields: ['title', 'profilePicture', 'category', 'bubbleType'],

		    events: {
		      limit: 10,
		      fields: ['name', 'author', 'submitted', 'postType', 'bubbleId', 'dateTime', 'commentsCount', 'attendees']
		    },

		    discussions: {
		      limit: 10,
		      fields: ['name', 'author', 'submitted', 'postType', 'bubbleId', 'dateTime', 'commentsCount']
		    },

		    files: {
		      limit: 10,
		      fields: ['name', 'author', 'submitted', 'postType', 'bubbleId', 'dateTime', 'commentsCount']
		    },

		    members: {
		      limit: 10,
		      fields: ['username', 'name', 'profilePicture']
		    },

		    admins: {
		      limit: 10,
		      fields: ['username', 'name', 'profilePicture']
		    },

		    applicants: {
		      limit: 10,
		      fields: ['username', 'name', 'profilePicture']
		    },

		    invitees: {
		      limit: 10,
		      fields: ['username', 'name', 'profilePicture']
		    },

		    callback: function(){
		      console.log('Bubbledata changed');
		      bubbleDep.changed();
		      Session.set('isLoading', false);
		    }
  		});
	}
}


Template.bubbleMembersPageBB.rendered = function () {
	var currentBubbleId = window.location.pathname.split('/')[2];
	Meteor.subscribe('singleBubble', currentBubbleId, function() {
		Session.set("isLoading", false);
	});
	console.log(currentBubbleId);
	var currentBubble = Bubbles.findOne({_id: currentBubbleId});
	var adminIds = currentBubble.users.admins;
	var memberIds = currentBubble.users.members;
	//var userIds = adminIds.concat(memberIds);
	//Meteor.subscribe('findUsersById', userIds);
	var applicantIds = currentBubble.users.applicants;
	var inviteeIds = currentBubble.users.invitees;
	var userIds = applicantIds.concat(adminIds, memberIds, inviteeIds);
	Meteor.subscribe('findUsersById', userIds.slice(0, 20));

	var userIdList = Session.get("selectedUserIdList");

	var userIdArray = [];
	_.each(userIdList, function(userId)
	{
		userIdArray.push(userId);
	});
	var bubble = Bubbles.findOne({_id: Session.get("currentBubbleId")});
	_.each(bubble.users.admins, function(userId)
	{
		userIdArray.push(userId);
	});
	_.each(bubble.users.applicants, function(userId)
	{
		userIdArray.push(userId);
	});
	_.each(bubble.users.members, function(userId)
	{
		userIdArray.push(userId);
	});
	_.each(bubble.users.invitees, function(userId)
	{
		userIdArray.push(userId);
	});
	Session.set("selectedUserIdList",userIdArray);

	//var numIds = 10;
	//var page = 0;

	$("#main").scroll(function(){
		console.log('Scrolltop, mainheight, documentheight, windowheight: ', $("#main").scrollTop(), $("#main").height(), $(document).height(), $(window).height());
	    //if ( ($("#main").scrollTop() >= $(document).height() + $("#main").height() - 10) ) {
	    if($("#main").scrollTop() > max_scrolltop){
		    //console.log('Pre paginating: ', page, $("#main").scrollTop(), $("#main").height(), $(document).height());
		    //console.log('Scrolling: ', page, userIds.slice(oldpage*10, page*10));
		    max_scrolltop = $("#main").scrollTop() + 200;
		    virtualPage = virtualPage + 1;
		    var pageUserIds = userIds.slice((virtualPage)*5, (virtualPage+1)*5);
		    Meteor.subscribe('findUsersById', pageUserIds);
		    console.log('Paginating: ', (virtualPage)*5, (virtualPage+1)*5);
		    console.log('End of Page');
		}
	    
	  });

};

Template.bubbleMembersPageBB.helpers({
	members: function() {
		return mybubbles.Members.getJSON();
	},
	admins: function() {
		return mybubbles.Admins.getJSON();
	},
	invitees: function() {
		return mybubbles.Invitees.getJSON();
	},
	applicants: function() {
		return mybubbles.Applicants.getJSON();
	},
	applicantsHasMembers: function() {
		if(this.users.applicants.length == 0)
		{
			return false;
		}
		else
		{
			return true;
		}
	},

	adminsHasMembers: function() {
		if(this.users.admins.length == 0)
		{
			return false;
		}
		else
		{
			return true;
		}
	},

	membersHasMembers: function() {
		if(this.users.members.length == 0)
		{
			return false;
		}
		else
		{
			return true;
		}
	},

	inviteesHasMembers: function() {
		if(this.users.invitees.length == 0)
		{
			return false;
		}
		else
		{
			return true;
		}
	}
});