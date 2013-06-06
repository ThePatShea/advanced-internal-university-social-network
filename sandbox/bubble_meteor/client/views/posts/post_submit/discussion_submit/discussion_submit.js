Template.discussionSubmit.helpers({
  bubble: function() {
    return Bubbles.findOne(Session.get('currentBubbleId'));
  }
});

Template.discussionSubmit.events({
  'submit form': function(event) {
    event.preventDefault();
    
    var post = {
    	name: $(event.target).find('[name=name]').val(),
      body: $(event.target).find('[name=body]').val(),
      postType: 'discussion'
    }

    createObject(post,'post','postPage');

  }
});
