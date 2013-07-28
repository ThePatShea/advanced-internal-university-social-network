Template.commentSubmit.helpers({
  validateForm: function(event, template) {
    if ( $(event.target).find('[name=body]').val() == "" )
      return true;
    else
      return false;
  }
});

Template.commentSubmit.events({
  'submit form': function(event, template) {
    event.preventDefault();
    
    //Google Analytics
    _gaq.push(['_trackEvent', 'Comment', 'Add', template.data._id]);

    var comment = {
      body: $(event.target).find('[name=body]').val(),
      postId: template.data._id
    };
    
    Meteor.call('comment', comment, function(error, commentId) {
      error && throwError(error.reason);
    });
  }
});

Template.commentSubmit.rendered = function() {
  $('.submit-comment').click(function() {
    setTimeout(function(){
      if (!$('.cb-error').length) {
        $('#main').animate({
          scrollTop: $('#main').prop('scrollHeight')
        }, 2000);
      }
    },500);
  });



 // Make the submit button disabled/grayed out if any required inputs have not been filled out
   function inspectAllInputFields(){
     var count = 0;
     $('.required').each(function(i){
       if( $(this).val() === '' && $(this).attr("name") != undefined) {
         count++;
       }

        if(count == 0){
          $('.cb-submit').prop('disabled', false);
          $('.cb-submit').removeClass('ready-false');
        }else {
          $('.cb-submit').prop('disabled', true);
          $('.cb-submit').addClass('ready-false');
        }
     });
   }

   $('.required').each(function() {
      var elem = $(this);
   
      // Save current value of element
      elem.data('oldVal', elem.val());
   
      // Look for changes in the value
      elem.bind("propertychange keyup input paste", function(event){
         // If value has changed...
         if (elem.data('oldVal') != elem.val()) {
          // Updated stored value
          elem.data('oldVal', elem.val());
   
          // Do action
          inspectAllInputFields();
        }
      });
    });

   $('.cb-submit').prop('disabled', true);
   $('.cb-submit').addClass('ready-false');
   inspectAllInputFields();
}
