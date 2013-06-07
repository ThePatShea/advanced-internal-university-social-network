Template.eventSubmit.events({
  'submit form': function(event) {
    event.preventDefault();

    createPost({ 
      dateTime: $(event.target).find('[name=dateTime]').val(),
      location: $(event.target).find('[name=location]').val(),
      name: $(event.target).find('[name=name]').val(),
      body: $(event.target).find('[name=body]').val(),
      postType: 'event',
      bubbleId: Session.get('currentBubbleId')
    });
  }
});

Template.eventSubmit.rendered = function() {
  $(".date-picker").glDatePicker({cssName: 'flatwhite'});
}
