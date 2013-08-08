Template.generateForm.created = function () {
  this.validateForm = function() {
    var validate  =  this.data.validate;
    var count     =  0;

    for (var i = 0; i < validate.length; i++) {
      var currentInput  =  $("[name=" + validate[i] + "]");
      var currentTag    =  currentInput.prop('tagName');

      if (currentTag == "INPUT")
        var inputTest   =  currentInput.val();
      else if (currentTag == "DIV")
        var inputTest   =  currentInput.html().trim().replace("<br>","").replace('<span class="wysiwyg-placeholder">Type here...</span>','');
      else
        var inputTest   =  "";

      if (inputTest == "")
        count++;

      alert("validation: " + count);  // TESTING

      if (count == 0) {
        $('.cb-submit').prop('disabled', false);
        $('.cb-submit').removeClass('ready-false');
      } else {
        $('.cb-submit').prop('disabled', true);
        $('.cb-submit').addClass('ready-false');
      }
    }

  }
}


Template.generateForm.rendered = function () {
  this.validateForm();
}


Template.generateForm.events({
    'keyup, propertychange, input, paste, click, mouseout li': function(evt, tmpl) {
      tmpl.validateForm();
    }
});
