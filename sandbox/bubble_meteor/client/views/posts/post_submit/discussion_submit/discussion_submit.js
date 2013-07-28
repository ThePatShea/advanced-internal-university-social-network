Template.discussionSubmit.events({
    'load .required, keyup .required, propertychange .required, input .required, paste .required': function() {
       var count = 0;

       $('.required').each(function(i) {
         if( !$(this).hasClass('wysiwyg') && $(this).val() === '' && $(this).attr("name") != undefined ) {
           count++;
         } else if ( $(this).hasClass('wysiwyg') && $(this).html().trim().replace("<br>","").replace('<span class="wysiwyg-placeholder">Type here...</span>','') == "" ) {
           count++;
         }

         if (count == 0) {
           $('.cb-submit').prop('disabled', false);
           $('.cb-submit').removeClass('ready-false');
         } else {
           $('.cb-submit').prop('disabled', true);
           $('.cb-submit').addClass('ready-false');
         }
       });
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
      
    }
});
