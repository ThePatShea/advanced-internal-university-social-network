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
      new ExploresApp.List.Controller({id: id});
    },

    show: function(id, region){
      if(!region) {
        this.list(id);
        return;
      }

      new ExploresApp.Show.Controller({id: id, region: region});
    }
  };

  App.commands.setHandler("show:explore", function(explore, region){
    App.navigate("explore/" + explore.id)
    API.show(explore.id, region);
  });

  App.addInitializer(function(){
    router = new ExploresApp.Router({controller: API});
  });

});