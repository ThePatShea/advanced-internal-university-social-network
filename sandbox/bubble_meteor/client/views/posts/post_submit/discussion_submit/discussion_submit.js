Template.discussionSubmit.created = function () {
  discussionFiles = [];
  discussionDeletedFileIndices = [];
  var mto = "";
  this.validateForm = function() {
    var count = 0;

    $('#cb-form-container-discussion-create .required').each(function(i) {
      if( !$(this).hasClass('wysiwyg') && $(this).val() === '' && $(this).attr("name") != undefined ) {
        count++;
      } else if ( $(this).hasClass('wysiwyg') && $(this).html().trim().replace("<br>","").replace('<span class="wysiwyg-placeholder">Type here...</span>','') == "" ) {
        count++;
      }

      if (count == 0) {
        $('#cb-form-container-discussion-create .cb-submit').prop('disabled', false);
        $('#cb-form-container-discussion-create .cb-submit').removeClass('ready-false');
      } else {
        $('#cb-form-container-discussion-create .cb-submit').prop('disabled', true);
        $('#cb-form-container-discussion-create .cb-submit').addClass('ready-false');
      }
    });
  }
}

Template.discussionSubmit.rendered = function () {
  this.validateForm();

  //Log clicking of description wisiwyg
  $(".discussion-title").on("click", function() {
    Meteor.clearTimeout(mto);
    mto = Meteor.setTimeout(function() {
      //Logs the action that user is doing
      Meteor.call('createLog', 
        { action: 'click-discussionNameTextbox',
          overwritePage: 'create-discussion' }, 
        window.location.pathname, 
        function(error) { if(error) { throwError(error.reason); }
      });
    }, 500);
  });

  //Log clicking of description wisiwyg
  $(".wysiwyg").on("click", function() {
    Meteor.clearTimeout(mto);
    mto = Meteor.setTimeout(function() {
      //Logs the action that user is doing
      Meteor.call('createLog', 
        { action: 'click-discussionDescriptionTextbox',
          overwritePage: 'create-discussion' }, 
        window.location.pathname, 
        function(error) { if(error) { throwError(error.reason); }
      });
    }, 500);
  });

  //Log clicking of attaching files
  $(".file-chooser-invisible").on("click", function() {
    Meteor.clearTimeout(mto);
    mto = Meteor.setTimeout(function() {
      //Logs the action that user is doing
      Meteor.call('createLog', 
        { action: 'click-discussionAttachFiles',
          overwritePage: 'create-discussion' }, 
        window.location.pathname, 
        function(error) { if(error) { throwError(error.reason); }
      });
    }, 500);
  });

  //Log clicking of submit button
  $(".words-main").on("click", function() {
    Meteor.clearTimeout(mto);
    mto = Meteor.setTimeout(function() {
      //Logs the action that user is doing
      Meteor.call('createLog', 
        { action: 'click-discussionSubmitButton',
          overwritePage: 'create-discussion' }, 
        window.location.pathname, 
        function(error) { if(error) { throwError(error.reason); }
      });
    }, 500);
  });

  //Log clicking of submit error button
  $(".words-error").on("click", function() {
    Meteor.clearTimeout(mto);
    mto = Meteor.setTimeout(function() {
      //Logs the action that user is doing
      Meteor.call('createLog', 
        { action: 'click-discussionErrorSubmitButton',
          overwritePage: 'create-discussion' }, 
        window.location.pathname, 
        function(error) { if(error) { throwError(error.reason); }
      });
    }, 500);
  });
}

Template.discussionSubmit.events({
  'keyup .required, propertychange .required, input .required, paste .required': function(evt, tmpl) {
      tmpl.validateForm();
  },

  'click .cb-discussionSubmit-form > .cb-submit-container > .cb-submit': function(event) {
      event.preventDefault();
      //Google Analytics
      _gaq.push(['_trackEvent', 'Post', 'Create Discussion', $(event.target).find('[name=name]').val()]);

      var bodySelector = $('.cb-discussionSubmit-form').find('.wysiwyg');
      var postBody = bodySelector.html();
      var rmIndex = postBody.indexOf('<span class="wysiwyg-placeholder">Type here...</span>');
      if(rmIndex != -1)
      {
        bodySelector.html(postBody.slice(0,rmIndex));
      }

      makeDiscussionPost();
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

    discussionFiles = fileAttachments;
    if(discussionFiles.length > 0){
      /*
      $('.cb-discussionSubmit-form > .paperclip-attach-files > .paperclip-attach > .cb-paperclip-lbl').hide();
      $('.cb-discussionSubmit-form > .paperclip-attach-files > .paperclip-attach > .cb-icon-attachment').hide();
      $('.cb-discussionSubmit-form > .paperclip-attach-files > .paperclip-attach > .file-chooser-invisible').width(1);
      $('.cb-discussionSubmit-form > .paperclip-attach-files > .paperclip-attach > .file-chooser-invisible').height(1);
      */
    }
    
    for (var i = 0, f; f = discussionFiles[i]; i++) {


      //If it is an image then render a thumbnail
      //if (f.type.match('image.*')) {
      //var img = Meteor.call('isImage', f.type);
      if(isValidFile(f.type)){
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile, discussionFiles, i) {
        return function(e) {
          if(theFile.size < 775000)
          {
            $('.cb-discussionSubmit-form > .paperclip-attach-files > .paperclip-attach > .cb-paperclip-lbl').hide();
            $('.cb-discussionSubmit-form > .paperclip-attach-files > .paperclip-attach > .cb-icon-attachment').hide();
            $('.cb-discussionSubmit-form > .paperclip-attach-files > .paperclip-attach > .file-chooser-invisible').width(1);
            $('.cb-discussionSubmit-form > .paperclip-attach-files > .paperclip-attach > .file-chooser-invisible').height(1);

            $('.cb-discussionSubmit-form > .paperclip-attach-files > .paperclip-attach > .attachments-list').append('<li><span class="attachment-cancel-icon" id="file-' + i + '"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 16 16" enable-background="new 0 0 16 16" xml:space="preserve"><circle fill-rule="evenodd" clip-rule="evenodd" cx="8" cy="8" r="8"/><g><rect x="7.001" y="4" transform="matrix(-0.7151 -0.699 0.699 -0.7151 8.1297 19.3133)" fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" width="2" height="8"/><rect x="7" y="4" transform="matrix(-0.6989 0.7152 -0.7152 -0.6989 19.3134 7.869)" fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" width="2" height="8"/></g></span><span class="attachment-list-filename">' + escape(theFile.name).replace(/%20/g, '_') +'</span></li>');
            $('.cb-discussionSubmit-form > .paperclip-attach-files > .paperclip-attach > .attachments-list > li > #file-'+i).click(function(){
              var index = this.id.split('-');
              discussionDeletedFileIndices.push(parseInt(index[1]));
              $(this).parent().remove();
            });
          } else {
            alert('Files cannot be larger than 775KB, please upload a different file.');
            return;
          }
        };
        })(f, discussionFiles, i);

        // Read in the image file as a data URL.
        reader.readAsDataURL(f);
      } else {
        console.log('Else');
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
          return function(e) {
          };
        })(f);

        reader.readAsDataURL(f);
      }
    }
}



function makeDiscussionPost(){
  var postAttributes = {
    name: encodeURIComponent($('.cb-discussionSubmit-form').find('[name=name]').val()),
    body: $('.cb-discussionSubmit-form').find('.wysiwyg').html(),
    postType: 'discussion',
    bubbleId: Session.get('currentBubbleId'),
    children: []
  }

  var newFiles = [];

  for(var i=0; i < discussionFiles.length; i++){
    if(discussionDeletedFileIndices.indexOf(i) == -1){
      console.log("Discussion File: ", discussionFiles[i]);
      if(isValidFile(discussionFiles[i].type)){
        newFiles.push(discussionFiles[i]);
      }
    }
  }

  createPostWithAttachments(postAttributes, newFiles);

  //Show Post submitted confirmation message
  var postTitle = $('.cb-discussionSubmit-form').find('[name=name]').val();
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
  setTimeout(displayPostConfirmationMessage(postTitle), 2000);

  $('.cb-discussionSubmit-form').find('[name=name]').val('');
  $('.cb-discussionSubmit-form').find('.wysiwyg').html('');
}



function isImage(typeInfo){
  if(typeInfo.match('image.*')){
    return true;
  }
  else{
    return false;
  }
}


function isValidFile(typeInfo){
  console.log('File type: ', typeInfo);
  if(typeInfo.match('vnd.*') || typeInfo.match('csv.*') || typeInfo.match('pdf.*') || typeInfo.match('zip.*') || typeInfo.match('postscript.*') || typeInfo.match('msword.*') || typeInfo.match('plain.*') || typeInfo.match('image.*')){
    return true;
  }
  else{
    return false;
  }
}
