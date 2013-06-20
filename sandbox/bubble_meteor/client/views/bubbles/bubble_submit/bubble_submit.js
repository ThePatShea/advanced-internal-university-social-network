Template.bubbleSubmit.events({
  'submit form': function(event) {
    event.preventDefault();

    var bubble = {
      title: $(event.target).find('[name=title]').val(),
      description: $(event.target).find('[name=description]').val(),
      category: $(event.target).find('[name=category]').val(),
      titleImage: $(event.target).find('[id=bubblepic]').attr('src')
    }
    
    Meteor.call('bubble', bubble, function(error, bubbleId) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
      } else {
        Meteor.Router.to('bubblePage', bubbleId);
      }
    });
  },


    'dragover #drop_zone': function(evt){
    console.log('Dragover');
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
  },

  'drop #drop_zone': function(evt){
    console.log('Drop');
        evt.stopPropagation();
    evt.preventDefault();

    files = evt.dataTransfer.files;
    if(files.length > 1){
      error = new Meteor.Error(422, 'Please choose only one image as the bubble image.');
      throwError(error.reason);
    }
    else{
      f = files[0];
      //If it is an image then render a thumbnail
      if (f.type.match('image.*')) {
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
        return function(e) {
        // Render thumbnail.
        dropzone = document.getElementById('drop_zone');
        parent = document.getElementById('bubble_image');
        parent.removeChild(dropzone);
        var span = document.createElement('span');
        span.innerHTML = ['<img id="bubblepic" class="thumb" src="', e.target.result,
                        '" title="', escape(theFile.name), '"/>'].join('');
        document.getElementById('bubble_image').appendChild(span);
        };
        })(f);

        // Read in the image file as a data URL.
        reader.readAsDataURL(f);
      }

      else{
        error = new Meteor.Error(422, 'Please choose a valid image.');
        throwError(error.reason);
      }
    }


    
  },

});
