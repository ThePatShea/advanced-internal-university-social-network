Template.discussionSubmit.created = function () {
  this.validateForm = function() {
    var count = 0;

    $('.required').each(function(i) {
      if( !$(this).hasClass('wysiwyg') && $(this).val() === '' && $(this).attr("name") != undefined ) {
        count++;
      } else if ( $(this).hasClass('wysiwyg') && $(this).html().trim().replace("<br>","").replace('<span class="wysiwyg-placeholder">Type here...</span>','') == "" ) {
        count++;
      }

      if (count == 0) {
        $('#cb-form-container-discussion .cb-submit').prop('disabled', false);
        $('#cb-form-container-discussion .cb-submit').removeClass('ready-false');
      } else {
        $('#cb-form-container-discussion .cb-submit').prop('disabled', true);
        $('#cb-form-container-discussion .cb-submit').addClass('ready-false');
      }
    });
  }
}

Template.discussionSubmit.rendered = function () {
  this.validateForm();
}

Template.discussionSubmit.events({
    'keyup .required, propertychange .required, input .required, paste .required': function(evt, tmpl) {
      tmpl.validateForm();
    }
  , 'submit form': function(event) {
      event.preventDefault();
      //Google Analytics
      _gaq.push(['_trackEvent', 'Post', 'Create Discussion', $(event.target).find('[name=name]').val()]);
      
      createPostWithAttachments({
        name: $(event.target).find('[name=name]').val(),
        body: $(event.target).find('.wysiwyg').html(),
        postType: 'discussion',
        bubbleId: Session.get('currentBubbleId'),
        children: []
      }, files);
      
    },

  'change .cb-discussionSubmit-form > .paperclip-attach-files > .paperclip-attach > .file-chooser-invisible': function(evt){
    console.log('Paperclip attach');

    evt.stopPropagation();
    evt.preventDefault();

    processAttachmentSelections(evt.target.files);
    
  }

});




function processAttachmentSelections(fileAttachments){
  //cpnsole.log(fileAttachments);

    files = fileAttachments;
    
    for (var i = 0, f; f = files[i]; i++) {


      //If it is an image then render a thumbnail
      if (f.type.match('image.*')) {
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
        return function(e) {
        $('.cb-discussionSubmit-form > .paperclip-attach-files > .paperclip-attach > .attachments-list').append('<li><img class="previewthumb" src="'+ e.target.result+
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
            $('.cb-discussionSubmit-form > .paperclip-attach-files > .paperclip-attach > .attachments-list').append("<li><div class='add-padding'><div class='cb-icon cb-icon-file'> <svg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='32.041px' height='31.966px' viewBox='0 0 32.041 31.966' enable-background='new 0 0 32.041 31.966' xml:space='preserve'> <path fill-rule='evenodd' clip-rule='evenodd' d='M30,7V6H12V2H2v8h10h18V7z M2,17v13h2h6h20V12H7H4H2V17z M31,32H13H7H1 c-0.55,0-1-0.45-1-1V1c0-0.55,0.45-1,1-1h12c0.55,0,1,0.45,1,1v3h17c0.549,0,1,0.45,1,1v26C32,31.55,31.549,32,31,32z'/></svg></div><div class='cb-icon-lbl file-name'>" + theFile.name+ "</div></div></li>");
          };
        })(f);

        reader.readAsDataURL(f);
      }
    }
}
