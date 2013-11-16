App.module('ExploresApp', function(ExploresApp, App, Backbone, Marionette, $, _){

  ExploresApp.Router = Marionette.AppRouter.extend({
    appRoutes: {
      'explore':      'list',
      'explore/:id':  'show'
    }
  });

  var API = {
    list: function(id, region){
      App.vent.trigger("sidebar:change", "explore")
      App.navigate('explore/1', {trigger: true});
    },

      new ExploresApp.List.Controller();
    show: function(id, region){
    }
  };

  App.addInitializer(function(){
    router = new ExploresApp.Router({controller: API});
  });

});