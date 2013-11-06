App.module("BubblesApp", function(BubblesApp, App, Backbone, Marionette, $, _) {

  BubblesApp.Router = Marionette.AppRouter.extend({
    appRoutes: {
      "Bubbles": "list"
    }
  });

  var API = {
    list: function(nav) {
      // App.vent.trigger("sidebar:change", "Bubbles")
      new BubblesApp.List.Controller();
    },
    show: function(bubble, region) {
      new BubblesApp.Show.Controller({ bubble: bubble, region: region });
    }
  };

  App.commands.setHandler('show:bubble', function(bubble, region) {
    API.show(bubble, region);
  });

  App.addInitializer(function(){
    return new BubblesApp.Router({controller: API})
  });

});
