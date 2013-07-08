userId: Meteor.userId(), Template.updateItem.helpers({
	getPost: function() {
		return Posts.findOne(this.postId);
	},
	getNewCommentsCount: function() {
		return Updates.find({postId:this.postId, updateType:'REPLIED', read:false}).count();
	},
	getBubble: function() {
		return Bubbles.findOne(this.bubbleId);
	},
	getContentTitle: function() {
		if(this.updateType == "NEW ATTENDEE" || 
				this.updateType == "JOINED BUBBLE" || 
				this.updateType == "MEMBER PROMOTED" || 
				this.updateType == "MEMBER DEMOTED" ||
				this.updateType == "NEW APPLICANT") {
			return 'Member List';
		}else if(this.updateType == "REPLIED" || 
				this.updateType == "POSTED" || 
				this.updateType == "EDITED POST") {
			var post = Posts.findOne(this.postId);
			return post.name;
		}else if(this.updateType == "REMOVED FROM BUBBLE" || 
				this.updateType == "APPLICATION REJECTED") {
			return 'Bubble List';
		}else{
			return 'Placeholder Only. URL is not decided yet!:D';
		}
	}
});

Template.updateItem.events({
  'click a': function() {	
  	Meteor.call('setRead', this);
  }
});
