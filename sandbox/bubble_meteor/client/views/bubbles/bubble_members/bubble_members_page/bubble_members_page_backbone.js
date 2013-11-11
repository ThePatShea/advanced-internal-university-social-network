Template.bubbleMembersPageBackbone.destroyed = function() {
	delete bubbleDep;
	delete bubbleMembersDep;
	delete bubbleAdminsDep;
	delete bubbleApplicantsDep;
	delete bubbleInviteesDep;
}

Template.bubbleMembersPageBackbone.created = function() {
	/*virtualPage = 0;
	max_scrolltop = 200;
	var test = Session.get('currentBubbleId');*/
	Session.set("isLoading",true);
	currentBubbleId = window.location.pathname.split('/')[2];
	Session.set("currentBubbleId", currentBubbleId);
	Meteor.subscribe("findBubblesById", [currentBubbleId], function(){
	    console.log("Current Bubble Id: ", currentBubbleId);
	    var users = Bubbles.findOne({_id: currentBubbleId}).users;
	    if(typeof rejectList == 'undefined'){
	    	rejectList = [];
	    }
	    rejectList = rejectList.concat(users.admins, users.members,users.applicants); 
	    rejectList.push(Meteor.userId());
      Session.set("selectList",users.invitees);
	});

	bubbleDep = new Deps.Dependency;
	bubbleMembersDep = new Deps.Dependency;
	bubbleAdminsDep = new Deps.Dependency;
	bubbleApplicantsDep = new Deps.Dependency;
	bubbleInviteesDep = new Deps.Dependency;

	bubbleMembersHelper();
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
		bubbleAdminsDep.depend();
		return mybubbles.Admins;
	},
	membersObj: function() {
		bubbleMembersDep.depend();
		return mybubbles.Members;
	},
	inviteesObj: function() {
		bubbleInviteesDep.depend();
		return mybubbles.Invitees;
	},
	applicantsObj: function() {
		bubbleApplicantsDep.depend();
		return mybubbles.Applicants;
	},
	isSuperBubble: function() {
		//bubbleDep.depend();
		var bubbleInfo = mybubbles.bubbleInfo.toJSON();
		return 'super' == bubbleInfo.bubbleType;
	}
});

var bubbleMembersHelper = function() {
  if(typeof mybubbles === "undefined")
  {
    mybubbles = new BubbleData.MyBubbles({
      bubbleId: currentBubbleId,
      limit: 10,
      fields: ['title', 'profilePicture', 'category', 'bubbleType'],

      events: {
        limit: 0,
        fields: ['name', 'author', 'submitted', 'postType', 'bubbleId', 'dateTime', 'commentsCount', 'attendees', 'viewCount', 'userId']
      },

      discussions: {
        limit: 0,
        fields: ['name', 'author', 'submitted', 'postType', 'bubbleId', 'dateTime', 'commentsCount', 'viewCount', 'userId']
      },

      files: {
        limit: 0,
        fields: ['name', 'author', 'submitted', 'postType', 'bubbleId', 'dateTime', 'commentsCount', 'viewCount', 'userId']
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
        Session.set('isLoading', false);
      }
    });
  }
  else
  {
  	var ready = 0;
    mybubbles.Admins.setLimit(10, function(){
      console.log("Admins Limit set to '10'");
      mybubbles.Admins.fetchPage(mybubbles.Admins.getCurrentPage(),function(){
        bubbleAdminsDep.changed();
        ready++;
        if(ready == 4)
        	Session.set('isLoading', false);
      });
    });
    mybubbles.Members.setLimit(10, function(){
      console.log("Members Limit set to '10'");
      mybubbles.Members.fetchPage(mybubbles.Members.getCurrentPage(),function(){
        bubbleMembersDep.changed();
        ready++;
        if(ready == 4)
        	Session.set('isLoading', false);
      });
    });
    mybubbles.Applicants.setLimit(10, function(){
      console.log("Applicants Limit set to '10'");
      mybubbles.Applicants.fetchPage(mybubbles.Applicants.getCurrentPage(),function(){
        bubbleApplicantsDep.changed();
        ready++;
        if(ready == 4)
        	Session.set('isLoading', false);
      });
    });
    mybubbles.Invitees.setLimit(10, function(){
      console.log("Invitees Limit set to '10'");
      mybubbles.Invitees.fetchPage(mybubbles.Invitees.getCurrentPage(),function(){
        bubbleInviteesDep.changed();
        ready++;
        if(ready == 4)
        	Session.set('isLoading', false);
      });
    });
  }
};