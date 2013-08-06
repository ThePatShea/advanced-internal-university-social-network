Handlebars.registerHelper("systemBubble", {
  selectedBubble : function() {
    var currentUrl   =  window.location.pathname;
    var urlArray     =  currentUrl.split("/");
    var urlBubbleId  =  urlArray[2];

    var selectedBubble  =  Bubbles.findOne(urlBubbleId);

    return selectedBubble;
  }
});
