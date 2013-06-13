Template.discussionSubmit.events({
  'submit form': function(event) {
    event.preventDefault();
    
    createPost({
      name: $(event.target).find('[name=name]').val(),
      body: $(event.target).find('[name=body]').val(),
      postType: 'discussion',
      bubbleId: Session.get('currentBubbleId')
    });

  }
});
