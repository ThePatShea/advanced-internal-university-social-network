Handlebars.registerHelper("systemForm", {
    formData     : {

    }
  , formParams   : {
        bubble : {
            create : {
                templateName    : "formElementsBubbleCreate"
              , isCollapsed     : "collapse-false"
              , objectNameDash  : "bubble-create"
            }
        }
    }
  , formElements : function(templateName) {
      var elements = Template[templateName]();
     
      console.log(elements); //TEST

      return elements;
    }
});
