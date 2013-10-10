Template.userList.created = function(){
	that = this.data;
};

Template.userList.rendered = function(){
	that = this.data;
	console.log("THIS CURRENT PAGE: ", this.data.getCurrentPage())
};

Template.userList.helpers({
	hasUsers: function() {
		if(this.getNumPages() == 0)
			return false
		return true;
	},
	loading: function() {
		return Session.get("isLoading");
	},
	header: function() {
		if(typeof this.bubbleAdmins !== "undefined")
			return "admins";
		if(typeof this.bubbleMembers !== "undefined")
			return "members";
		if(typeof this.bubbleInvitees !== "undefined")
			return "invitees";
		if(typeof this.bubbleApplicants !== "undefined")
			return "applicants";
	},
	users: function() {
		return this.getJSON();
	},
	isActivePage: function(type) {
		bubbleDep.depend();
		if(type == "members")
		{
		  	if(this.page == mybubbles.Members.getCurrentPage()+1)
		  		return "active";
		}
		if(type == "admins")
		{
		  	if(this.page == mybubbles.Admins.getCurrentPage()+1)
		  		return "active";
		}
		if(type == "invitees")
		{
		  	if(this.page == mybubbles.Invitees.getCurrentPage()+1)
		  		return "active";
		}
		if(type == "applicants")
		{
		  	if(this.page == mybubbles.Applicants.getCurrentPage()+1)
		  		return "active";
		}
	  	return "";
 	},
	pages: function() {
		/*
	  	var retVal = []
		for(var i=0; i<this.getNumPages(); i++)
		{
			retVal.push(i+1);
		}
		*/
		var type = "";
		var retVal = [];
		if(typeof this.bubbleAdmins !== "undefined")
			type = "admins";
		if(typeof this.bubbleMembers !== "undefined")
			type = "members";
		if(typeof this.bubbleInvitees !== "undefined")
			type = "invitees";
		if(typeof this.bubbleApplicants !== "undefined")
			type = "applicants";
		for(var i=0; i<this.getNumPages(); i++)
		{
			var tmp = {type: type, page: i+1};
			retVal.push(tmp);
		}
		return retVal;
	},
	idStringify: function() {
		return JSON.stringify(this);
	},
	showAll: function() {
		if(this.getNumPages() < 6)
			return true;
		return false;
	},
	show: function() {
		var scope;
		if(this.type == "members")
			scope = mybubbles.Members;
		if(this.type == "admins")
			scope = mybubbles.Admins;
		if(this.type == "invitees")
			scope = mybubbles.Invitees;
		if(this.type == "applicants")
			scope = mybubbles.Applicants;
		if(this.page == 1
			|| this.page == scope.getCurrentPage()
			|| this.page == scope.getCurrentPage() + 1
			|| this.page == scope.getCurrentPage() + 2
			|| this.page == scope.getNumPages())
			{
				return true;
			}
		return false;
	},
	elipses: function() {
		var scope;
		if(this.type == "members")
			scope = mybubbles.Members;
		if(this.type == "admins")
			scope = mybubbles.Admins;
		if(this.type == "invitees")
			scope = mybubbles.Invitees;
		if(this.type == "applicants")
			scope = mybubbles.Applicants;
		if(this.page == 2 || this.page == scope.getNumPages() - 1)
		{
			return true;
		}
		return false;
	}
});

Template.userList.events({
	'click .pageitem': function(e) {
		Session.set("isLoading", true);
		var pageitem = JSON.parse(e.target.id);
		//console.log("PAGEITEM: ", pageitem.type);
		//console.log("TYPE: ", pageitem.type, " | PAGE: ", pageitem.page);
		if(pageitem.type == "members")
		{
			console.log("TYPE: ", pageitem.type, " | PAGE: ", pageitem.page);
			mybubbles.Members.fetchPage(parseInt(pageitem.page)-1, function(res){
				bubbleDep.changed();
				Session.set("isLoading", false);
				console.log("CALLED", res);
			});
		};
		if(pageitem.type == "admins")
		{
			console.log("TYPE: ", pageitem.type, " | PAGE: ", pageitem.page);
			mybubbles.Admins.fetchPage(parseInt(pageitem.page)-1, function(res){
				bubbleDep.changed();
				Session.set("isLoading", false);
				console.log("CALLED", res);
			});
		};
		if(pageitem.type == "invitees")
		{
			console.log("TYPE: ", pageitem.type, " | PAGE: ", pageitem.page);
			mybubbles.Inviteess.fetchPage(parseInt(pageitem.page)-1, function(res){
				bubbleDep.changed();
				Session.set("isLoading", false);
				console.log("CALLED", res);
			});
		};
		if(pageitem.type == "applicants")
		{
			console.log("TYPE: ", pageitem.type, " | PAGE: ", pageitem.page);
			mybubbles.Applicants.fetchPage(parseInt(pageitem.page)-1, function(res){
				bubbleDep.changed();
				Session.set("isLoading", false);
				console.log("CALLED", res);
			});
		};
	},
	'click .prev': function() {
		Session.set("isLoading", true);
		this.fetchPrevPage(function(res){
			bubbleDep.changed();
			Session.set("isLoading", false);
			console.log("CALLED", res);
		});
	},
	'click .next': function() {
		Session.set("isLoading", true);
		this.fetchNextPage(function(res){
			bubbleDep.changed();
			Session.set("isLoading", false);
			console.log("CALLED", res);
		});
	}
});