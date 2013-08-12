Template.editDiscussion.created = function(){
  console.log('Children: ', this.data.children);
  console.log($('.cb-editDiscussion-form'));
  discussionAttachmentIds = this.data.children;
  discussionAttachments = Posts.find({_id: {$in: discussionAttachmentIds }}).fetch();
  discussionDeletedAttachmentIndices = [];
}


Template.editDiscussion.rendered = function () {

  //console.log('Children: ', this);
  //console.log('Children: ', this.data.children);
  //this.validateForm();
  //var discussion = this.data;
  //$(event.target).find("[name=name]").val(event.name);
  //$(event.target).find("[name=body]").html();

  //$('.cb-editDiscussion-form > .discussionTitle').val();
  //$('.cb-editDiscussion-form > .wysiwyg_group > .wysiwyg-body').html();
  //console.log('Rendered');
  for(var i=0; i < discussionAttachments.length; i++){
    console.log('Attachment: ', discussionAttachments[i].name);
    $('.cb-editDiscussion-form > .discussion-attachments > .paperclip-attach > .attachments-list').append('<li><span class="attachment-cancel-icon" id="file-' + i + '"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 16 16" enable-background="new 0 0 16 16" xml:space="preserve"><circle fill-rule="evenodd" clip-rule="evenodd" cx="8" cy="8" r="8"/><g><rect x="7.001" y="4" transform="matrix(-0.7151 -0.699 0.699 -0.7151 8.1297 19.3133)" fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" width="2" height="8"/><rect x="7" y="4" transform="matrix(-0.6989 0.7152 -0.7152 -0.6989 19.3134 7.869)" fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" width="2" height="8"/></g></span><span class="attachment-list-filename">' + discussionAttachments[i].name +'</span></li>');
    $('.cb-editDiscussion-form > .discussion-attachments > .paperclip-attach > .attachments-list > li > #file-'+i).click(function(){
      discussionDeletedAttachmentIndices.push(i);
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

    var newChildren = [];

    for(var i=0; i < discussionAttachmentIds.length; i++){
      if(discussionDeletedAttachmentIndices.indexOf(i) != -1){
        console.log('Removing: ', discussionAttachmentIds[i]);
        Posts.remove({_id: '"' + discussionAttachmentIds[i] + '"'});
      }
      else{
        newChildren.push(discussionAttachmentIds[i]);
      }
    }

    discussionAttachmentIds = [];
    discussionAttachments = [];
    discussionDeletedAttachmentIndices = [];

    var discussionAttributes = {
      name: $('.cb-editDiscussion-form > .discussionTitle').val(),
      body: $('.cb-editDiscussion-form > .wysiwyg_group > .wysiwyg-body').html(),
      children: newChildren
    };

    console.log(discussionAttributes);

    var currentPostId = Session.get('currentPostId');
    var currentBubbleId = Session.get('currentBubbleId');

    Posts.update(currentPostId, {$set: discussionAttributes}, function(error) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
      } else {
        createEditEventUpdate(Meteor.userId(), currentPostId);
        Meteor.Router.to('postPage', currentBubbleId, currentPostId);
      }
    });      
  }
});
