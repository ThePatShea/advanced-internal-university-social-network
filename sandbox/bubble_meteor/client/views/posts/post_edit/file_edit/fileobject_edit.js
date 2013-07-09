Template.fileobjectEdit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var currentPostId = Session.get('currentPostId');
    var currentBubbleId = Session.get('currentBubbleId');
    var dateTime = $(event.target).find('[name=date]').val() + " " + $(event.target).find('[name=time]').val();
    var f = files[0];
      var reader = new FileReader();
      reader.onload = (function(f){
        return function(e) {
          console.log(f.type);

          var postProperties = {
            dateTime: dateTime,
            name: escape(f.name),
            file: e.target.result,
            fileType: f.type,
            lastUpdated: new Date().getTime()
          };

          Posts.update(currentPostId, {$set: postProperties}, function(error) {
            if (error) {
              // display the error to the user
              throwError(error.reason);
            } else {
              Meteor.Router.to('postPage', currentBubbleId, currentPostId);
            }
          });
        }
      })(f);
      reader.readAsDataURL(f);

    Posts.update(currentPostId, {$set: postProperties}, function(error) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
      } else {
        Meteor.Router.to('postPage', currentBubbleId, currentPostId);
      }
    });
  },
  
  'click #delete_post': function(e) {
    e.preventDefault();
    if (confirm("Delete this post?")) {
      var currentPostId = Session.get('currentPostId');
      Posts.remove(currentPostId);
      Meteor.Router.to('bubblePage',Session.get('currentBubbleId'));
    }
  },

  'dragover .dropzone': function(evt){
    console.log('Dragover');
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
  },

  'drop .dropzone': function(evt){
    $(".dropzone").hide();
    $("#filesToUploade").hide();
    console.log('Drop');
        evt.stopPropagation();
    evt.preventDefault();

    files = evt.dataTransfer.files;

    //If more than one file dropped on the dropzone then throw an error to the user.
    if(files.length > 1){
      error = new Meteor.Error(422, 'Please choose only one file.');
      throwError(error.reason);
    }
    else{
      for (var i = 0, f; f = files[i]; i++) {


        //If it is an image then render a thumbnail
        if (f.type.match('image.*')) {
          var reader = new FileReader();

          // Closure to capture the file information.
          reader.onload = (function(theFile) {
          return function(e) {
          // Render thumbnail.
          var span = document.createElement('span');
          span.innerHTML = ['<img class="thumb" src="', e.target.result,
                          '" title="', escape(theFile.name), '"/>'].join('');
          document.getElementById('list').insertBefore(span, null);
          };
          })(f);

          // Read in the image file as a data URL.
          reader.readAsDataURL(f);
        }

        //If it is a PDF then render a PDF icon
        else if (f.type.match('pdf.*')){
          var reader = new FileReader();

          // Closure to capture the file information.
          reader.onload = (function(theFile) {
          return function(e) {
          //Render a PDF icon
          var span = document.createElement('span');
          span.innerHTML = ['<div class="pdf-icon">', 'PDF', escape(theFile.name), '</div>'].join('');
          document.getElementById('list').insertBefore(span, null);
          };
          })(f);

          //Read file as a data url.
          reader.readAsDataURL(f);
        }
        else if (f.type.match('msword.*') || f.type.match('ms-excel.*') || f.type.match('officedocument.*')){
          var reader = new FileReader();

          // Closure to capture the file information.
          reader.onload = (function(theFile) {
          return function(e) {
          //Render a PDF icon
          var span = document.createElement('span');
          span.innerHTML = ['<div class="word-icon">', 'Word Document: ', escape(theFile.name), '</div>'].join('');
          document.getElementById('list').insertBefore(span, null);
          };
          })(f);

          //Read file as a data url.
          reader.readAsDataURL(f);
        }
        else{
          console.log('Else');
          var reader = new FileReader();

          // Closure to capture the file information.
          reader.onload = (function(theFile) {
            return function(e) {
              console.log(e.target.result);
            };
          })(f);

          reader.readAsDataURL(f);
        }


      }
    }
  },

  'change #filesToUpload': function(evt){
    files = evt.target.files;
    $(".dropzone").hide();

    //If more than one file dropped on the dropzone then throw an error to the user.
    if(files.length > 1){
      error = new Meteor.Error(422, 'Please choose only one file.');
      throwError(error.reason);
    }
    else{
      l = document.getElementById('list');
      while(l.hasChildNodes()){
        l.removeChild(l.lastChild);
      };

      for (var i = 0, f; f = files[i]; i++) {


        //If it is an image then render a thumbnail
        if (f.type.match('image.*')) {
          var reader = new FileReader();

          // Closure to capture the file information.
          reader.onload = (function(theFile) {
          return function(e) {
          // Render thumbnail.
          var span = document.createElement('span');
          span.innerHTML = ['<img class="thumb" src="', e.target.result,
                          '" title="', escape(theFile.name), '"/>'].join('');
          document.getElementById('list').insertBefore(span, null);
          };
          })(f);

          // Read in the image file as a data URL.
          reader.readAsDataURL(f);
        }

        //If it is a PDF then render a PDF icon
        else if (f.type.match('pdf.*')){
          var reader = new FileReader();

          // Closure to capture the file information.
          reader.onload = (function(theFile) {
          return function(e) {
          //Render a PDF icon
          var span = document.createElement('span');
          span.innerHTML = ['<div class="pdf-icon">', 'PDF', escape(theFile.name), '</div>'].join('');
          document.getElementById('list').insertBefore(span, null);
          };
          })(f);

          //Read file as a data url.
          reader.readAsDataURL(f);
        }
        else if (f.type.match('msword.*') || f.type.match('ms-excel.*') || f.type.match('officedocument.*')){
          var reader = new FileReader();

          // Closure to capture the file information.
          reader.onload = (function(theFile) {
          return function(e) {
          //Render a PDF icon
          var span = document.createElement('span');
          span.innerHTML = ['<div class="word-icon">', 'Word Document: ', escape(theFile.name), '</div>'].join('');
          document.getElementById('list').insertBefore(span, null);
          };
          })(f);

          //Read file as a data url.
          reader.readAsDataURL(f);
        }
        else{
          console.log('Else');
          var reader = new FileReader();

          // Closure to capture the file information.
          reader.onload = (function(theFile) {
            return function(e) {
              console.log(e.target.result);
            };
          })(f);

          reader.readAsDataURL(f);
        }
      }
    }
  }
});


Template.fileobjectEdit.helpers({
  'isImage': function(){
    var currentPostId = Session.get('currentPostId');
    var post = Posts.findOne({_id: currentPostId});
    console.log(post.fileType);
    if(post.fileType.match('image.*')){
      return true;
    }
    else{
      return false
    }
  },

  'isPdf': function(){
    var currentPostId = Session.get('currentPostId');
    var post = Posts.findOne({_id: currentPostId});
    console.log(post.fileType);
    if(post.fileType.match('pdf.*')){
      return true;
    }
    else{
      return false
    }
  }
});


Template.fileobjectEdit.rendered = function(){
  $("#change_uploadedfile").click(function(){
    $("#uploadedfile_preview").hide();
    $("#change_uploadedfile").hide();
    $(".dropzone").show();
    $("#filesToUpload").show();
  });
 $(".dropzone").hide();
 $("#filesToUpload").hide();
};
