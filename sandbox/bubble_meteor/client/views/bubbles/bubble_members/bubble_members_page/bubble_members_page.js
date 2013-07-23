Template.bubbleMembersPage.rendered = function () {
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