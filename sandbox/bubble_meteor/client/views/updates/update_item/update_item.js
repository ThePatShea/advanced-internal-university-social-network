Template.updateItem.helpers({
    getPost: function() {
    	return Posts.findOne(this.postId);
    }
  , getNewCommentsCount: function() {
    	return Updates.find({postId:this.postId, updateType:'replied', userId: Meteor.userId(), read:false}).count();
    }
  , getBubble: function() {
    	return Bubbles.findOne(this.bubbleId);
    }
  , getContentTitle: function() {
    	if(this.updateType == "joined bubble" || 
    			this.updateType == "member promoted" || 
    			this.updateType == "member demoted" ||
    			this.updateType == "new applicant") {
    		return 'Member List';
    	}else if(this.updateType == "new attendee" || 
    			this.updateType == "replied" || 
    			this.updateType == "posted" || 
    			this.updateType == "edited post") {
    		var post = Posts.findOne(this.postId);
    		if(post){
    			return post.name;
    		}
    	}else if(this.updateType == "removed from bubble" || 
    			this.updateType == "application rejected") {
    		return 'Bubble List';
    	}else{
    		return 'Dismiss Update';
    	}
    }
  , getDisplayInfo: function() {
      //Meteor.subscribe('findUsersByUsername',this.invokerName);
      if(this.updateType == "new attendee"
      || this.updateType == "edited post"
      || this.updateType == "replied"
      || this.updateType == "posted") {
        var object = Posts.findOne(this.postId);
        if (object)
          return object;
      } else {
        var object = { };
        var user = Meteor.users.findOne({'username': this.invokerName}, {fields: {'name': 1}});
        console.log("User: ", user, " | invokerName: ", this.invokerName);
        if(typeof user !== "undefined")
          object.name = user.name;
        else
          object.name = this.invokerName;

        //object.name = this.invokerName;

        object.postType  =  'member';

        return object;
      }
    }
  ,	getProfilePicture: function() {
    Meteor.subscribe('getProfilePictureFromId',this.invokerId);
  	var user = Meteor.users.findOne(this.invokerId);
  	// console.log(this.invokerId);
  	return user && user.profilePicture;
  }
});

Template.updateItem.events({
  'click .update-item': function() {	
    Meteor.Router.to(this.url, this.bubbleId, this._id);
    Meteor.call('setRead', this);
  }
});


Template.updateItem.created = function(){
  Meteor.subscribe('updatedPosts', Meteor.userId());
}
