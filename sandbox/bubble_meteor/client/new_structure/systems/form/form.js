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
              , selectedBubbleType : "normal"
              , arrowVisible       : "false"
            }
        }
    }
  , formElements : function(templateName) {
      return Template[templateName]();
    }
});


Template.formElementsBubbleCreate.events({
  'click .select-bubble-type > .normal': function(evt, tmpl) {
    evt.preventDefault();
    systemForm.formParams.bubble.create.selectedBubbleType = "normal";
  }

 , 'click .select-bubble-type > .super': function(evt, tmpl) {
    evt.preventDefault();
    systemForm.formParams.bubble.create.selectedBubbleType = "super";
  }
});


Template.formElementsBubbleCreate.helpers({
    isSelectedBubbleType: function(inputBubbleType) {
      if (inputBubbleType == this.selectedBubbleType)
        return true;
      else
        return false;
    }
});
