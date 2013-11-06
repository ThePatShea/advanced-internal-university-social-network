App.module("SidebarApp", function(SidebarApp, App, Backbone, Marionette, $, _) {
  this.startWithParent = false;

  var API = {
    list: function(navs) {
      new SidebarApp.List.Controller({ navs: navs, region: App.sidebarRegion });
    }
  };

  SidebarApp.on('start', function(nav){
    API.navs = App.request("nav:entities");
    API.list(API.navs);
  });

  App.vent.on("nav:clicked", function(nav){
    App.navigate(nav.get("name"), {trigger: true});
    // App.vent.trigger("main:app:dashboard")
  });
  
  App.vent.on("sidebar:change", function(name){
    API.navs.chooseBy(name)
  });
});
