App.module("SearchApp", function(SearchApp, App, Backbone, Marionette, $, _) {

  SearchApp.Router = Marionette.AppRouter.extend({
    appRoutes: {
      "search": "list"
    }
  });

  var API = {
    list: function(nav) {
      App.vent.trigger("sidebar:change", "search");
      new SearchApp.List.Controller();
    }
  };

  App.addInitializer(function(){
    return new SearchApp.Router({controller: API})
  });

});
