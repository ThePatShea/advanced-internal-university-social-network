Template.bubbleMembersPage.rendered = function () {
	var currentBubbleId = window.location.pathname.split('/')[2];
	Meteor.subscribe('singleBubble', currentBubbleId);
	console.log(currentBubbleId);
	var currentBubble = Bubbles.findOne({_id: currentBubbleId});
	var adminIds = currentBubble.users.admins;
	var memberIds = currentBubble.users.members;
	//var userIds = adminIds.concat(memberIds);
	//Meteor.subscribe('findUsersById', userIds);
	var applicantIds = currentBubble.users.applicants;
	var inviteeIds = currentBubble.users.invitees;
	var userIds = applicantIds.concat(adminIds, memberIds, inviteeIds);
	Meteor.subscribe('findUsersById', userIds.slice(0, 10));

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
	var index = 0;
	var oldpage = 0;

	$("#main").scroll(function(){
	    //if ( ($("#main").scrollTop() >= $("#main")[0].scrollHeight - $("#main").height()) ) {
	    	var page = Math.round( $("#main").scrollTop()/$("#main").height() );
	    	//var oldpage = page;
	    	console.log('Pre paginating: ', page, $("#main").scrollTop(), $("#main").height(), $(document).height());
	    if ( page > 0  && page != oldpage){
	      //alert(page);
	      console.log('Scrolling: ', page, userIds.slice(oldpage*10, page*10));
	      var pageUserIds = userIds.slice(oldpage*10, page*10);
	      Meteor.subscribe('findUsersById', pageUserIds);
	    }
	    oldpage = page;
	  });

};

Template.bubbleMembersPage.helpers({
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