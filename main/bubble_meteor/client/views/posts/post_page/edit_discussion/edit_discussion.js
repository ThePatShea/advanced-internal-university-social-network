Template.editDiscussion.events({
  'keyup .required, propertychange .required, input .required, paste .required': function(evt, tmpl) {
      tmpl.validateForm();
  }
});








Template.editDiscussion.created = function(){
  discussionFiles = [];
  discussionDeletedFileIndices = [];
  this.validateForm = function() {
    var count = 0;

    $('#cb-form-container-edit-discussion .required').each(function(i) {
      if( !$(this).hasClass('wysiwyg') && $(this).val() === '' && $(this).attr("name") != undefined ) {
        count++;
      } else if ( $(this).hasClass('wysiwyg') && $(this).html().trim().replace("<br>","").replace('<span class="wysiwyg-placeholder">Type here...</span>','') == "" ) {
        count++;
      }


      if (count == 0) {
        $('#cb-form-container-edit-discussion .cb-submit').prop('disabled', false);
        $('#cb-form-container-edit-discussion .cb-submit').removeClass('ready-false');
      } else {
        $('#cb-form-container-edit-discussion .cb-submit').prop('disabled', true);
        $('#cb-form-container-edit-discussion .cb-submit').addClass('ready-false');
      }
    });
  }



  console.log('Children: ', this.data.children);
  console.log($('.cb-editDiscussion-form'));
  discussionAttachmentIds = this.data.children;
  discussionAttachments = Posts.find({_id: {$in: discussionAttachmentIds }}).fetch();
  discussionDeletedAttachmentIndices = [];
  discussionDeletedAttachmentIds = [];
  discussionNewAttachments = [];
  discussionDeletedNewAttachmentIndices = [];
}


Template.editDiscussion.rendered = function () {
  this.validateForm();



  $('.cb-editDiscussion-form > .discussion-attachments > .paperclip-attach > .attachments-list > li').remove();

  discussionAttachmentIds = this.data.children;
  discussionAttachments = Posts.find({_id: {$in: discussionAttachmentIds }}).fetch();
  for(var i=0; i < discussionAttachments.length; i++){
    console.log('Attachment: ', discussionAttachments[i].name);
    $('.cb-editDiscussion-form > .discussion-attachments > .paperclip-attach > .attachments-list').append('<li><span class="attachment-cancel-icon" id="' + discussionAttachments[i]._id + '"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 16 16" enable-background="new 0 0 16 16" xml:space="preserve"><circle fill-rule="evenodd" clip-rule="evenodd" cx="8" cy="8" r="8"/><g><rect x="7.001" y="4" transform="matrix(-0.7151 -0.699 0.699 -0.7151 8.1297 19.3133)" fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" width="2" height="8"/><rect x="7" y="4" transform="matrix(-0.6989 0.7152 -0.7152 -0.6989 19.3134 7.869)" fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" width="2" height="8"/></g></span><span class="attachment-list-filename">' + discussionAttachments[i].name +'</span></li>');
    $('.cb-editDiscussion-form > .discussion-attachments > .paperclip-attach > .attachments-list > li > #'+discussionAttachments[i]._id).click(function(){
      discussionDeletedAttachmentIds.push(this.id);
      $(this).parent().remove();
    });
  }
}


Template.editDiscussion.events({
  'click .cb-editDiscussion-form > .cb-submit-container > .cb-submit': function(event) {
    event.preventDefault();
    event.stopPropagation();
    //Google Analytics
    _gaq.push(['_trackEvent', 'Post', 'Create Discussion', $(event.target).find('[name=name]').val()]);

    updateDiscussionPost();
  },

  'change .cb-editDiscussion-form > .paperclip-attach-files > .paperclip-attach > .file-chooser-invisible': function(evt){
    console.log('Paperclip attach');

    evt.stopPropagation();
    evt.preventDefault();

    processAttachmentSelections(evt.target.files);
    
  }

});




/****************************************************Javascript Helper Functions******************************************************/

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


function processAttachmentSelections(fileAttachments){
  //cpnsole.log(fileAttachments);

    //discussionNewAttachments = fileAttachments;
    for(var i=0; i < fileAttachments.length; i++){
      discussionNewAttachments.push(fileAttachments[i]);
    }
    console.log(discussionNewAttachments);
    if(discussionNewAttachments.length > 0){
      $('.cb-editDiscussion-form > .paperclip-attach-files').hide();
      $('.cb-editDiscussion-form > .paperclip-attach-files > .paperclip-attach > .cb-paperclip-lbl').hide();
      $('.cb-editDiscussion-form > .paperclip-attach-files > .paperclip-attach > .cb-icon-attachment').hide();
      $('.cb-editDiscussion-form > .paperclip-attach-files > .paperclip-attach > .file-chooser-invisible').width(1);
      $('.cb-editDiscussion-form > .paperclip-attach-files > .paperclip-attach > .file-chooser-invisible').height(1);
    }
    $('.cb-editDiscussion-form > .discussion-attachments > .paperclip-attach > .attachments-list').html('');
    for(var i=0; i < discussionAttachments.length; i++){
      if(discussionDeletedAttachmentIds.indexOf(discussionAttachments[i]._id) == -1){
        console.log('Attachment: ', discussionAttachments[i].name);
        $('.cb-editDiscussion-form > .discussion-attachments > .paperclip-attach > .attachments-list').append('<li><span class="attachment-cancel-icon" id="' + discussionAttachments[i]._id + '"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 16 16" enable-background="new 0 0 16 16" xml:space="preserve"><circle fill-rule="evenodd" clip-rule="evenodd" cx="8" cy="8" r="8"/><g><rect x="7.001" y="4" transform="matrix(-0.7151 -0.699 0.699 -0.7151 8.1297 19.3133)" fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" width="2" height="8"/><rect x="7" y="4" transform="matrix(-0.6989 0.7152 -0.7152 -0.6989 19.3134 7.869)" fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" width="2" height="8"/></g></span><span class="attachment-list-filename">' + discussionAttachments[i].name +'</span></li>');
        $('.cb-editDiscussion-form > .discussion-attachments > .paperclip-attach > .attachments-list > li > #'+discussionAttachments[i]._id).click(function(){
          discussionDeletedAttachmentIds.push(this.id);
          $(this).parent().remove();
        });
      }
    }
    
    for (var i = 0, f; f = discussionNewAttachments[i]; i++) {


      //If it is an image then render a thumbnail
      if(isValidFile(f.type)){
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile, discussionNewAttachments, i) {
        return function(e) {
          $('.cb-editDiscussion-form > .discussion-attachments > .paperclip-attach > .attachments-list').append('<li><span class="attachment-cancel-icon" id="file-' + i + '"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 16 16" enable-background="new 0 0 16 16" xml:space="preserve"><circle fill-rule="evenodd" clip-rule="evenodd" cx="8" cy="8" r="8"/><g><rect x="7.001" y="4" transform="matrix(-0.7151 -0.699 0.699 -0.7151 8.1297 19.3133)" fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" width="2" height="8"/><rect x="7" y="4" transform="matrix(-0.6989 0.7152 -0.7152 -0.6989 19.3134 7.869)" fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" width="2" height="8"/></g></span><span class="attachment-list-filename">' + escape(theFile.name).replace(/%20/g, '_') +'</span></li>');
          $('.cb-editDiscussion-form > .discussion-attachments > .paperclip-attach > .attachments-list > li > #file-'+i).click(function(){
            var index = this.id.split('-');
            discussionDeletedNewAttachmentIndices.push(parseInt(index[1]));
            $(this).parent().remove();
          });
        };
        })(f, discussionNewAttachments, i);

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



function updateDiscussionPost(){

  var newFiles = [];

  for(var i=0; i < discussionNewAttachments.length; i++){
    if(discussionDeletedNewAttachmentIndices.indexOf(i) == -1){
      if(isValidFile(discussionNewAttachments[i].type)){
        newFiles.push(discussionNewAttachments[i]);
      }
    }
  }

    var newChildren = [];
    console.log(discussionDeletedAttachmentIds);
    for(var j=0; j < discussionDeletedAttachmentIds.length; j++){
      Posts.remove({_id: discussionDeletedAttachmentIds[j]});
    }

    console.log(discussionDeletedAttachmentIds);
    console.log(discussionDeletedAttachmentIds);
    for(var i=0; i < discussionAttachmentIds.length; i++){
      console.log('Remove or not: ', discussionAttachmentIds[i], discussionDeletedAttachmentIds.indexOf(discussionAttachmentIds[i]));
      if(discussionDeletedAttachmentIds.indexOf(discussionAttachmentIds[i]) == -1){
        console.log('Not removing: ', discussionAttachmentIds[i]);
        newChildren.push(discussionAttachmentIds[i]);
      }
    }

    console.log('The new kids: ', newChildren);

    //discussionAttachmentIds = [];
    discussionAttachments = [];
    discussionDeletedAttachmentIndices = [];

    var currentPostId = Session.get('currentPostId');
    var currentBubbleId = Session.get('currentBubbleId');

    var discussionAttributes = {
      name: $('.cb-editDiscussion-form > .discussionTitle').val(),
      body: $.trim( $('.cb-editDiscussion-form > .wysiwyg_group').find('.wysiwyg').html() ),
      //bubbleId: currentBubbleId,
      //children: newChildren
    };

    if(newChildren.length > 0){
      discussionAttributes.children = newChildren;
    }
    else{
      discussionAttributes.children = [];
    }


    console.log(discussionAttributes);

    


  updatePostWithAttachments(currentPostId, discussionAttributes, newFiles);

  discussionDeletedAttachmentIndices = [];
  discussionDeletedAttachmentIds = [];
  discussionNewAttachments = [];
  discussionDeletedNewAttachmentIndices = [];

  /*discussionAttachmentIds = Posts.findOne({_id: currentPostId}).children;

  discussionAttachments = Posts.find({_id: {$in: discussionAttachmentIds }}).fetch();*/

}
