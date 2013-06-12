Template.discussionSubmit.events({
  'submit form': function(event) {
    event.preventDefault();
    
    createPost({
      name: $(event.target).find('[name=name]').val(),
      body: $(event.target).find('[name=body]').val(),
      postType: 'discussion',
      bubbleId: Session.get('currentBubbleId')
    });
    var bubble = Bubbles.findOne(Session.get('currentBubbleId'));
    _.each(getEveryone(bubble),function(userId){
			if (userId) {
	      sendEmail(userId, 'New Post', 'New post for your bubble');
	    }else{
	      console.log("User is undefined for sending emails");
	    }
    });
    
  }
});
