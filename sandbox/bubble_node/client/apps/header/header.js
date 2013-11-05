App.module('HeaderApp', function(HeaderApp, App, Backbone, Marionette, $, _) {
  this.startWithParent = false
  
  this.API = {
    list: function() {
      HeaderApp.controller = new HeaderApp.List.Controller({region: App.header});
    }
  }
  
  HeaderApp.on("start", function() { HeaderApp.API.list(); });
});