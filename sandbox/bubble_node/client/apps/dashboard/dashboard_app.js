App.module("DashboardApp", function(DashboardApp, App, Backbone, Marionette, $, _) {

  DashboardApp.Router = Marionette.AppRouter.extend({
    appRoutes: {
      "dashboard": "list"
    }
  });

  var API = {
    list: function(nav) {
      App.vent.trigger("sidebar:change", "dashboard");
      new DashboardApp.List.Controller();
    }
  };

  App.addInitializer(function(){
    return new DashboardApp.Router({controller: API})
  });

});
