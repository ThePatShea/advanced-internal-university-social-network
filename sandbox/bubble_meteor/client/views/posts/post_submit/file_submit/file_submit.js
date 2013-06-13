Template.fileSubmit.events({
  'submit form': function(e, template) {
    e.preventDefault();

    var name = $(e.target).find('[name=name]').val();
    var file = template.find('[name=file]').files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
      createPost({
        name: name,
        file: e.target.result,
        postType: 'file',
        bubbleId: Session.get('currentBubbleId')
      });
    }
    reader.readAsDataURL(file);
  }
});
