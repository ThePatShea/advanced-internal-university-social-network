//TODO: Make it so you can't submit a bubble create form that has no category

Template.generateForm.created = function () {
  this.validateForm = function() {
    var validate  =  this.data.validate;
    var count     =  0;

    for (var i = 0; i < validate.length; i++) {
      var currentInput  =  $("[name=" + validate[i] + "]");
      var inputHtml     =  currentInput.html();
      var inputVal      =  currentInput.val();

      console.log( currentInput.prop('tagName') + " -- " + inputVal );
    }







/*
    $(this.data.validate).each(function(i) {
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
*/


  }
}


Template.generateForm.rendered = function () {
  this.validateForm();
}


Template.generateForm.events({
    'keyup, propertychange, input, paste': function(evt, tmpl) {
      tmpl.validateForm();
    }
});
