Template.postAttachments.helpers({
	attachmentList: function(){
		var postId = Session.get('currentPostId');
		//var post = Posts.findOne({_id: postId});
		var attachments = [];
		console.log("POSTID: ", postId, " | THIS: ", this);
		if(this.postType == 'discussion'){
			var postAttachments = this.children;
			for(var i = 0; i < postAttachments.length; i++){
				//var attachment = Posts.findOne({_id: postAttachments[i]});
				//attachments.push(attachment);
				var attachmentData = new BubbleData.ExplorePostPage(postAttachments[i]);
					attachments.push(attachmentData.explorePost.toJSON());
					console.log("ATTACHMENT: ", attachmentData.explorePost.toJSON());
			}
		}

		console.log(attachments);
		return attachments;
	},

	listAttachments: function(){
		//postAttachmentsDep.depend();
		return true;
	}
});

Template.postAttachments.created = function() {
	//postAttachmentsDep = new Deps.Dependency;
};

Template.postAttachments.events({
    'click .file-download': function(evt){
    	evt.preventDefault();
    	evt.stopPropagation();
    	alert('1');
        console.log("File Download Click: ", this);
    }
})