Handlebars.registerHelper("systemForm", {
  formParams   : {
    bubble : {
      create : {
        validate       : ["title", "category", "body"],
        templateName   : "formElementsBubbleCreate",
        isCollapsed    : "collapse-false",
        objectNameDash : "bubble-create",
        wysiwygHeading : "Description",
        arrowVisible   : "false"
      },
      edit   : {
        validate       : ["title", "category", "body"],
        templateName   : "formElementsBubbleCreate",
        isCollapsed    : "collapse-true",
        objectNameDash : "bubble-edit",
        wysiwygHeading : "Description",
        arrowVisible   : "false",
      }
    },
    file   : {
      create : {
        validate       : [],
        templateName   : "formElementsFileCreate",
        isCollapsed    : "collapse-true",
        objectNameDash : "file-create",
        arrowVisible   : "true",
      }
    }
  }
});
