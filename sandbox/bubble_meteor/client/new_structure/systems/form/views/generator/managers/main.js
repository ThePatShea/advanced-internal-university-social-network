Template.generateForm.helpers({
  formElements  : function(templateName) {
    return Template[templateName]();
  }
});


Template.generateForm.events({
  'submit form' : function(evt) {
    evt.preventDefault();
    this.submit();
  }
});
