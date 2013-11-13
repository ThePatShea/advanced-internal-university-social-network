Template.fileSubmit.events({
  'click .cb-fileSubmit-form > .cb-submit-container > .cb-submit': function(evt) {
    evt.preventDefault();
    console.log('Submitting files.');
    //Google Analytics
    _gaq.push(['_trackEvent', 'Post', 'Create File', $(evt.target).find('[name=name]').val()]);

    for (var i = 0, f; f = files[i]; i++) {
      var reader = new FileReader();
      reader.onload = (function(f){
        return function(e) {
          console.log("FILE TO UPLOAD...Type: ",f.type, " | Size: ",f.size);
          
          if(f.size < 775000)
          {
            createPost({
              name: escape(f.name).replace(/%20/g, '_'),
              file: e.target.result,
              fileType: f.type,
              fileSize: f.size,
              postType: 'file',
              numDownloads: 0,
              lastDownloadTime: new Date().getTime(),
              bubbleId: Session.get('currentBubbleId')
            });

            //Show Post submitted confirmation message
            var postTitle = encodeURIComponent($('.cb-discussionSubmit-form').find('[name=name]').val());
            var displayPostConfirmationMessage = function(postTitle){
              return function(){
                //postTitle = encodeURIComponent($('.cb-discussionSubmit-form').find('[name=name]').val());
                var message = postTitle.slice(0, 7);
                var message = message + ' ...';
                $('.info').removeClass('visible-false');
                $('.message-container .info').text(message);
                $('.message-container').removeClass('visible-false');
                $('.message-container').addClass('message-container-active');
                setTimeout(function(){
                  $('.message-container').removeClass('message-container-active');
                  $('.message-container').addClass('visible-false');
                  clearTimeout();
                },5000);
              }        
            }
            console.log('Post Title: ', postTitle);
            setTimeout(displayPostConfirmationMessage('File'), 1000);
          } else {
            alert('Files cannot be larger than 775KB, please upload a different file.');
            return;
          }
        }
      })(f);
      reader.readAsDataURL(f);
    }

    files = [];
  },

  'dragover .cb-fileSubmit-form > .attach-files > .drop-zone': function(evt){
    console.log('Dragover');
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
  },

  'drop .cb-fileSubmit-form > .attach-files > .drop-zone': function(evt){

    evt.stopPropagation();
    evt.preventDefault();

    processAttachmentSelections(evt.dataTransfer.files);
  },

  'change .cb-fileSubmit-form > .attach-files > .drop-zone > .file-chooser-invisible': function(evt){

    evt.stopPropagation();
    evt.preventDefault();

    processAttachmentSelections(evt.target.files);
    
  }



});


Template.fileSubmit.helpers({
  getFileUploadAttributes: function(){
    var fileUploadAttributes = {
      'fileArray': []
    };

    return fileUploadAttributes;
  }
});


Template.fileSubmit.created = function(){
  files = [];
  var mto = '';
}

Template.fileSubmit.rendered = function(){

  //Log clicking of uploading button
  $(".file-chooser-invisible").on("click", function() {
    if(typeof mto !== "undefined")
    {
      Meteor.clearTimeout(mto);
    }
    mto = Meteor.setTimeout(function() {
      //Logs the action that user is doing
      Meteor.call('createLog', 
        { action: 'click-fileAttachFile',
          overwritePage: 'create-file' }, 
        window.location.pathname, 
        function(error) { if(error) { throwError(error.reason); }
      });
    }, 500);
  });

  //Log clicking of submit button
  $(".file-submit").on("click", function() {
    if(typeof mto !== "undefined")
    {
      Meteor.clearTimeout(mto);
    }
    mto = Meteor.setTimeout(function() {
      //Logs the action that user is doing
      Meteor.call('createLog', 
        { action: 'click-fileSubmitButton',
          overwritePage: 'create-file' }, 
        window.location.pathname, 
        function(error) { if(error) { throwError(error.reason); }
      });
    }, 500);
  });

}



function processAttachmentSelections(fileAttachments){

    files = fileAttachments;

    $('.cb-fileSubmit-form > .attach-files > .drop-zone > .attachments-list').html('');
    
    for (var i = 0, f; f = files[i]; i++) {


      //If it is an image then render a thumbnail
      if (f.type.match('image.*')) {
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
        return function(e) {
        $('.cb-fileSubmit-form > .attach-files > .drop-zone > .attachments-list').append('<li><img class="previewthumb" src="'+ e.target.result+
                        '" title="'+ escape(theFile.name)+ '"></li>');
        };
        })(f);

        // Read in the image file as a data URL.
        reader.readAsDataURL(f);
      } else {
        console.log('Else');
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
          return function(e) {
            console.log(e.target.result);
            $('.cb-fileSubmit-form > .attach-files > .drop-zone > .attachments-list').append("<li><div class='add-padding'><div class='cb-icon cb-icon-file'> <svg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='32.041px' height='31.966px' viewBox='0 0 32.041 31.966' enable-background='new 0 0 32.041 31.966' xml:space='preserve'> <path fill-rule='evenodd' clip-rule='evenodd' d='M30,7V6H12V2H2v8h10h18V7z M2,17v13h2h6h20V12H7H4H2V17z M31,32H13H7H1 c-0.55,0-1-0.45-1-1V1c0-0.55,0.45-1,1-1h12c0.55,0,1,0.45,1,1v3h17c0.549,0,1,0.45,1,1v26C32,31.55,31.549,32,31,32z'/></svg></div><div class='cb-icon-lbl file-name'>" + theFile.name+ "</div></div></li>");
          };
        })(f);

        reader.readAsDataURL(f);
      }
    }
}
