Template.exploreDiscussionSubmit.created = function () {
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

Template.exploreDiscussionSubmit.rendered = function () {
  this.validateForm();
}

Template.exploreDiscussionSubmit.events({
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
        exploreId: Session.get('currentExploreId'),
        children: []
      }, files);
      
    }
});
