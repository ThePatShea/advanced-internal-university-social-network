Template.exploreDiscussionSubmit.created = function () {
  discussionFiles = [];
  discussionDeletedFileIndices = [];
  this.validateForm = function() {
    var count = 0;

    $('#cb-form-container-discussion .required').each(function(i) {
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

Template.exploreDiscussionSubmit.rendered = function () {
  var postAsType = $("[name=post-as-type]").val();
  //$(".postAsButton." + postAsType).addClass("active-true");

  $(".post-as-button.bubble").mouseover(function() {
    $(".post-as-bubble-dropdown").show();
  });

  $(".post-as-button.bubble").mouseout(function() {
    $(".post-as-bubble-dropdown").hide();
  });

  $(".btn-select-post-as-bubble").click(function() {
    var postAsId = $(this).attr("name");
    $("[name=post-as-id]").val(postAsId);
    $("[name=post-as-type]").val("bubble");



    var bubbleTitle = $(this).children(".bubble-title").attr("name");
    $(".selected-bubble-post-as").html(bubbleTitle);

    $(".post-as-button.bubble").removeClass("active-false");
    $(".post-as-button.bubble").addClass("active-true");

    $(".post-as-button.me").removeClass("active-true");
    $(".post-as-button.me").addClass("active-false");

    $(".post-as-bubble-dropdown").hide();
  });


  $(".post-as-button.me").click(function() {
    $("[name=post-as-id]").val( Meteor.userId() );
    $("[name=post-as-type]").val("user");



    $(".post-as-button.bubble").removeClass("active-true");
    $(".post-as-button.bubble").addClass("active-false");

    $(".post-as-button.me").removeClass("active-false");
    $(".post-as-button.me").addClass("active-true");

    $(".selected-bubble-post-as").html("Select a bubble");
  });









  this.validateForm();
}


Template.exploreDiscussionSubmit.helpers({
  getCurrentUserId: function() {
    return Meteor.userId();
  },
  getAdminBubbles: function() {
    adminBubblesCount  =  Bubbles.find({"users.admins": Meteor.userId()}).count();
    adminBubbles       =  Bubbles.find({"users.admins": Meteor.userId()});

    if (adminBubblesCount > 0) {
      return adminBubbles;
    } else {
      return false;
    }
  }
});


Template.exploreDiscussionSubmit.events({
  'click .post-as-button': function(event) {
    event.preventDefault();
  },
  'keyup .required, propertychange .required, input .required, paste .required, click button': function(evt, tmpl) {
    tmpl.validateForm();
  },

  'click .cb-explore-discussionSubmit-form > .cb-submit-container > .cb-submit': function(event) {
      event.preventDefault();
      //Google Analytics
      _gaq.push(['_trackEvent', 'Post', 'Create Discussion', $(event.target).find('[name=name]').val()]);
      
      /*createPostWithAttachments({
        name: $(event.target).find('[name=name]').val(),
        body: $(event.target).find('.wysiwyg').html(),
        postType: 'discussion',
        exploreId: Session.get('currentExploreId'),
        children: []
      }, files);*/

      makeDiscussionPost();
      
    },

  'change .cb-explore-discussionSubmit-form > .paperclip-attach-files > .paperclip-attach > .file-chooser-invisible': function(evt){
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
      $('.cb-explore-discussionSubmit-form > .paperclip-attach-files > .paperclip-attach > .cb-paperclip-lbl').hide();
      $('.cb-explore-discussionSubmit-form > .paperclip-attach-files > .paperclip-attach > .cb-icon-attachment').hide();
      $('.cb-explore-discussionSubmit-form > .paperclip-attach-files > .paperclip-attach > .file-chooser-invisible').width(1);
      $('.cb-explore-discussionSubmit-form > .paperclip-attach-files > .paperclip-attach > .file-chooser-invisible').height(1);
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
          $('.cb-explore-discussionSubmit-form > .paperclip-attach-files > .paperclip-attach > .attachments-list').append('<li><span class="attachment-cancel-icon" id="file-' + i + '"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 16 16" enable-background="new 0 0 16 16" xml:space="preserve"><circle fill-rule="evenodd" clip-rule="evenodd" cx="8" cy="8" r="8"/><g><rect x="7.001" y="4" transform="matrix(-0.7151 -0.699 0.699 -0.7151 8.1297 19.3133)" fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" width="2" height="8"/><rect x="7" y="4" transform="matrix(-0.6989 0.7152 -0.7152 -0.6989 19.3134 7.869)" fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" width="2" height="8"/></g></span><span class="attachment-list-filename">' + escape(theFile.name).replace(/%20/g, '_') +'</span></li>');
          $('.cb-explore-discussionSubmit-form > .paperclip-attach-files > .paperclip-attach > .attachments-list > li > #file-'+i).click(function(){
            var index = this.id.split('-');
            discussionDeletedFileIndices.push(parseInt(index[1]));
            $(this).parent().remove();
          });
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
    name: $('.cb-explore-discussionSubmit-form').find('[name=name]').val(),
    body: $('.cb-explore-discussionSubmit-form').find('.wysiwyg').html(),
    postAsType: $('.cb-explore-discussionSubmit-form .post-as-type').val(),
    postAsId:   $('.cb-explore-discussionSubmit-form .post-as-id').val(),
    postType: 'discussion',
    exploreId: Session.get('currentExploreId'),
    children: []
  }

  if(postAttributes.postAsType == 'user'){
    postAttributes.author = Meteor.user().username;
  }
  else{
    postAttributes.author = Bubbles.findOne({_id: postAttributes.postAsId}).title;
  }
  console.log('Post Attributes', postAttributes);

  var newFiles = [];

  for(var i=0; i < discussionFiles.length; i++){
    if(discussionDeletedFileIndices.indexOf(i) == -1){
      if(isValidFile(discussionFiles[i].type)){
        newFiles.push(discussionFiles[i]);
      }
    }
  }
  
  createPostWithAttachments(postAttributes, newFiles);
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

