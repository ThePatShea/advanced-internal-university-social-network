Template.discussionSubmit.events({
  'submit form': function(event) {
    event.preventDefault();
    //Google Analytics
    _gaq.push(['_trackEvent', 'Post', 'Create Discussion', $(event.target).find('[name=name]').val()]);
    
    createPostWithAttachments({
      name: $(event.target).find('[name=name]').val(),
      body: $(event.target).find('.wysiwyg').html(),
      postType: 'discussion',
      bubbleId: Session.get('currentBubbleId'),
      children: []
    }, files);
    
  }
});
