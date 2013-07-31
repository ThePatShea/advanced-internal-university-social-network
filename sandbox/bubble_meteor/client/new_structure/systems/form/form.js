/*
Handlebars.registerHelper('formSystem', {
  generateForm : function() {
    Meteor.render("<b>form goes here</b>"); 
  }
});
*/


Handlebars.registerHelper('formSystem', {
  return "<b>form goes here</b>"; 
});
