App.module("SidebarApp", function(SidebarApp, App, Marionette, Backbone, $, _) {
  this.startWithParent = false;

  var API = {
    list: function(nav) {
      new SidebarApp.List.Controller({ region: App.sidebarRegion });
    }
  };

  SidebarApp.on('start', function(nav){
    API.list(nav);
  });
});
