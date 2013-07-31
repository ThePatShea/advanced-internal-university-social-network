Handlebars.registerHelper("systemForm", {
    formData     : {
      // For edit forms
    }
  , formParams   : {
        bubble : {
            create : {
                validate        : ["title", "category", "body"]
              , templateName    : "formElementsBubbleCreate"
              , isCollapsed     : "collapse-false"
              , objectNameDash  : "bubble-create"
            }
        }
    }
  , formElements : function(templateName) {
      return Template[templateName]();
    }
});
