App.module("SidebarApp", function(SidebarApp, App, Marionette, Backbone, $, _) {
  this.startWithParent = false;

  API = {
    list: function(nav) {
      new SidebarApp.List.Controller({ region: App.sidebarRegion });
    }
  };

  SidebarApp.on('start', function(nav){
    API.list(nav);
  });

  App.commands.setHandler("choose:nav", function(nav){
    // this.collection.chooseBySomething(nav);
    SidebarApp.start(nav)
  });
});
