Handlebars.registerHelper("systemForm", {
    formData     : {
      // For edit forms
    }
  , formParams   : {
        bubble : {
            create : {
                validate           : ["title", "category", "body"]
              , templateName       : "formElementsBubbleCreate"
              , isCollapsed        : "collapse-false"
              , objectNameDash     : "bubble-create"
              , wysiwygHeading     : "Description"
              , arrowVisible       : "false"
            }
        }
    }
  , formElements : function(templateName) {
      return Template[templateName]();
    }
});


Template.formElementsBubbleCreate.events({
  'click .select-bubble-type > .normal': function(evt) {
    evt.preventDefault();
    $("input[name=bubbleType]").val("normal");
    selectedBubbleType = "normal";
    $(".select-bubble-type > .super").removeClass("active-true");
    $(".select-bubble-type > .normal").addClass("active-true");
  }
, 'click .select-bubble-type > .super': function(evt) {
    evt.preventDefault();
    $("input[name=bubbleType]").val("super");
    $(".select-bubble-type > .normal").removeClass("active-true");
    $(".select-bubble-type > .super").addClass("active-true");
  }

});
