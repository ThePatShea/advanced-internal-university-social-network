Template.fileSubmit.events({
  'submit form': function(e, template) {
    e.preventDefault();

    var file = template.find('[name=file]').files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
      createPost({
        name: $(e.target).find('[name=name]').val(),
        file: e.target.result,
        postType: 'file',
        bubbleId: Session.get('currentBubbleId')
      });
    }
    reader.readAsDataURL(file);
  }
});
