Template.bubbleSectionSelectorBackbone.helpers({
    isSelected         : function(inputName) {
      var currentUrl  =  window.location.pathname;
      var urlArray    =  currentUrl.split("/");
       
      return urlArray[3] == inputName;
    }
});
