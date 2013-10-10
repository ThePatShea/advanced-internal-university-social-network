Template.commentSubmit.created = function() {
  mto = "";
}

Template.commentSubmit.helpers({
  validateForm: function(event, template) {
    if ( $(event.target).find('[name=body]').val() == "" )
      return true;
    else
      return false;
  }
});

Template.commentSubmit.events({
  'click .comment-form > .cb-submit-container > .cb-submit': function(event, template) {
    event.preventDefault();
    
    //Google Analytics
    _gaq.push(['_trackEvent', 'Comment', 'Add', template.data._id]);

    var comment = {
      //body: $(event.target).find('[name=body]').val(),
      //body: $($('.comment-form > .body')).val(),
      body: $('.comment-form').find('[name=body]').val(),
      postId: template.data._id
    };
    
    Meteor.call('comment', comment, function(error, commentId) {
      //Logs the action that user is doing
      Meteor.call('createLog', 
        { action: 'click-submitNewComment' }, 
        window.location.pathname, 
        function(error) { if(error) { throwError(error.reason); }
      });
      error && throwError(error.reason);
    });

    Meteor.subscribe('comments', template.data._id);
  }
});

Template.commentSubmit.rendered = function() {
  //Log clicking of comment box
  $(".required").on("click", function() {
    Meteor.clearTimeout(mto);
    mto = Meteor.setTimeout(function() {
      //Logs the action that user is doing
      Meteor.call('createLog',  
        { action: 'click-commentTextbox' }, 
        window.location.pathname, 
        function(error) { if(error) { throwError(error.reason); }
      });
    }, 500);
  });


  $('.comment-form > .cb-submit-container > .submit-comment').click(function() {
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
     $('#cb-form-container-comment .required').each(function(i){
       if( $(this).val() === '' && $(this).attr("name") != undefined) {
         count++;
       }

        if(count == 0){
          $('#cb-form-container-comment .cb-submit').prop('disabled', false);
          $('#cb-form-container-comment .cb-submit').removeClass('ready-false');
        }else {
          $('#cb-form-container-comment .cb-submit').prop('disabled', true);
          $('#cb-form-container-comment .cb-submit').addClass('ready-false');
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

   $('#cb-form-container-comment .cb-submit').prop('disabled', true);
   $('#cb-form-container-comment .cb-submit').addClass('ready-false');
   inspectAllInputFields();
}
