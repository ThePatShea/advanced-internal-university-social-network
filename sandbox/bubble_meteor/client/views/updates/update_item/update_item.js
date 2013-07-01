userId: Meteor.userId(), Template.updateItem.helpers({
	getPost: function() {
		return Posts.findOne(this.postId);
	},
	isPost: function() {
		if(this.updateType == "REPLIED" || 
				this.updateType == "POSTED" || 
				this.updateType == "EDITED POST") {
			return true;
		}
	},
	isBubbleMember: function() {
		if(this.updateType == "NEW ATTENDEE" || 
				this.updateType == "JOINED BUBBLE" || 
				this.updateType == "MEMBER PROMOTED" || 
				this.updateType == "MEMBER DEMOTED" ||
				this.updateType == "NEW APPLICANT") {
			return true;
		}
	},
	isBubbleList: function() {
		if(this.updateType == "REMOVED FROM BUBBLE" || 
				this.updateType == "APPLICATION REJECTED") {
			return true;
		}
	},
	getNewCommentsCount: function() {
		return Updates.find({postId:this.postId, updateType:'REPLIED', read:false}).count();
	},
	getBubble: function() {
		return Bubbles.findOne(this.bubbleId);
	}
});

Template.updateItem.events({
  'click a': function() {	
  	Meteor.call('setRead', this);
  }
});
