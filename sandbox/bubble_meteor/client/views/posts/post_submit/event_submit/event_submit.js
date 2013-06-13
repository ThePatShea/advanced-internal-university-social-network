Template.eventSubmit.events({
  'submit form': function(event) {
    event.preventDefault();

    var dateTime = $(event.target).find('[name=date]').val() + " " + $(event.target).find('[name=time]').val();

    createPost({ 
      dateTime: dateTime,
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
