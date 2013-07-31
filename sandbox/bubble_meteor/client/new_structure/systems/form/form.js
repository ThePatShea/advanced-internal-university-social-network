Handlebars.registerHelper("systemForm", {
    formData     : {
      // For edit forms
    }
  , formParams   : {
        bubble : {
            create : {
                validate       : ["title", "category", "body"]
              , templateName   : "formElementsBubbleCreate"
              , isCollapsed    : "collapse-false"
              , objectNameDash : "bubble-create"
              , wysiwygHeading : "Description"
              , arrowVisible   : "false"
            }
        }
    }
  , formElements : function(templateName) {
      return Template[templateName]();
    }
});
