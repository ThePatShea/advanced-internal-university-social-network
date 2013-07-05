Template.postAttachments.helpers({
	'attachmentList': function(){
		var postId = Session.get('currentPostId');
		var post = Posts.findOne({_id: postId});
		var attachments = [];
		console.log(postId);
		if(post.postType == 'discussion'){
			var postAttachments = post.children;
			for(var i = 0; i < postAttachments.length; i++){
				var attachment = Posts.findOne({_id: postAttachments[i]});
				attachments.push(attachment);
			}
		}

		console.log(attachments);
		return attachments;
	}
});
