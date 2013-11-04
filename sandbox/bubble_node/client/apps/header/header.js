App.module('HeaderApp', function(HeaderApp, App, Backbone, Marionette, $, _) {
  this.startWithParent = false
  
  API = {
    list: function() {
      new HeaderApp.List.Controller({region: App.header});
    }
  }
  
  HeaderApp.on("start", function() { API.list(); });
});