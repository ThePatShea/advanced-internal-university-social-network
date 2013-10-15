Template.bubbleMembersPageBackbone.created = function() {
	virtualPage = 0;
	max_scrolltop = 200;
	currentBubbleId = window.location.pathname.split('/')[2];
	Session.set("currentBubbleId", currentBubbleId);
	Meteor.subscribe("findBubblesById", [currentBubbleId], function(){
	    console.log("Current Bubble Id: ", currentBubbleId);
	    var users = Bubbles.findOne({_id: currentBubbleId}).users;
	    if(typeof rejectList == 'undefined'){
	    	rejectList = [];
	    }
	    rejectList = rejectList.concat(users.invitees, users.admins, users.members, users.invitees, users.applicants); 
	    rejectList.push(Meteor.userId());
	});
	//membersDep = new Deps.Dependency;
	bubbleDep = new Deps.Dependency;

	//if(typeof bubbleDep === "undefined")
	//	bubbleDep = new Deps.Dependency;
	
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
		      fields: ['username', 'name', 'profilePicture', 'userType']
		    },

		    admins: {
		      limit: 10,
		      fields: ['username', 'name', 'profilePicture', 'userType']
		    },

		    applicants: {
		      limit: 10,
		      fields: ['username', 'name', 'profilePicture', 'userType']
		    },

		    invitees: {
		      limit: 10,
		      fields: ['username', 'name', 'profilePicture', 'userType']
		    },

		    callback: function(){
		      console.log('Bubbledata changed');
		      bubbleDep.changed();
		      //membersDep.changed();
		      Session.set('isLoading', false);
		    }
  		});
	}
}

Template.bubbleMembersPageBackbone.rendered = function () {
	console.log("Current Bubble Id: ", currentBubbleId);
};

Template.bubbleMembersPageBackbone.helpers({
	getCurrentBubbleBackbone: function(){
		//bubbleDep.depend();
		var bubble = mybubbles.bubbleInfo.toJSON();
		return bubble;
	},
	adminsObj: function() {
		//membersDep.depend();
		bubbleDep.depend();
		return mybubbles.Admins;
	},
	membersObj: function() {
		//membersDep.depend();
		bubbleDep.depend();
		return mybubbles.Members;
	},
	inviteesObj: function() {
		//membersDep.depend();
		bubbleDep.depend();
		return mybubbles.Invitees;
	},
	applicantsObj: function() {
		//membersDep.depend();
		bubbleDep.depend();
		return mybubbles.Applicants;
	},
	isSuperBubble: function() {
		//bubbleDep.depend();
		var bubbleInfo = mybubbles.bubbleInfo.toJSON();
		return 'super' == bubbleInfo.bubbleType;
	}
});