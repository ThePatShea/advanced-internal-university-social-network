Template.editDiscussion.rendered = function () {
  this.validateForm();
  var discussion = this.data;
  $(event.target).find("[name=name]").val(event.name);
  $(event.target).find("[name=body]").html();
}

Template.editDiscussion.events({
  'submit form': function(event) {
    event.preventDefault();
    //Google Analytics
    _gaq.push(['_trackEvent', 'Post', 'Create Discussion', $(event.target).find('[name=name]').val()]);

    var discussionAttributes = {
      name: $(event.target).find("[name=name]").val(),
      body: $(event.target).find("[name=body]").html()
    };

    console.log(discussionAttributes);

    var currentPostId = Session.get('currentPostId');
    var currentBubbleId = Session.get('currentBubbleId');

    Posts.update(currentPostId, {$set: discussionAttributes}, function(error) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
      } else {
        createEditEventUpdate(Meteor.userId(), currentPostId);
        Meteor.Router.to('postPage', currentBubbleId, currentPostId);
      }
    });      
  }
});
