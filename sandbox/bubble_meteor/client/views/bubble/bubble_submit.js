Template.bubbleSubmit.events({
  'submit form': function(event) {
    event.preventDefault();

    var bubble = {
      title: $(event.target).find('[name=title]').val(),
      description: $(event.target).find('[name=description]').val()
    }
    
    createObject(bubble, 'bubble', 'bubblePage');

  }
});