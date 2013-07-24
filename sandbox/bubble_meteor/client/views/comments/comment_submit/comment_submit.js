Template.commentSubmit.events({
  'submit form': function(event, template) {
    event.preventDefault();
    
    //Google Analytics
    _gaq.push(['_trackEvent', 'Comment', 'Add', template.data._id]);

    var comment = {
      body: $(event.target).find('[name=body]').val(),
      postId: template.data._id
    };
    
    Meteor.call('comment', comment, function(error, commentId) {
      error && throwError(error.reason);

      if (!error) {
        $('html, body').animate({
          scrollTop: 700
        }, 2000);
      }
    });
  }
});

Template.commentSubmit.rendered = function() {
  $('.submit-comment').click(function() {
    $('#main').animate({
      scrollTop: $('#main').prop('scrollHeight')
    }, 2000);
  });
}
