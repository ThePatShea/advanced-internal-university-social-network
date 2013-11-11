App.module("SettingsApp", function(SettingsApp, App, Backbone, Marionette, $, _) {

  SettingsApp.Router = Marionette.AppRouter.extend({
    appRoutes: {
      "settings": "list"
    }
  });

  var API = {
    list: function(nav) {
      App.vent.trigger("sidebar:change", "settings");
      new SettingsApp.List.Controller();
    }
  };

  App.addInitializer(function(){
    return new SettingsApp.Router({controller: API})
  });

});
