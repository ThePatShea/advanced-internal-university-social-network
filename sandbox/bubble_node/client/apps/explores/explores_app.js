App.module('ExploresApp', function(ExploresApp, App, Backbone, Marionette, $, _){

  ExploresApp.Router = Marionette.AppRouter.extend({
    appRoutes: {
      'explore': 'enterExplore',
      'explore/:id': 'showExplore'
    }
  });

  var API = {
    enterExplore: function(){
      console.log('Explore: ');
      App.navigate('explore/1', {trigger: true});
    },

    showExplore: function(id){
      new ExploresApp.List.Controller();
      console.log('Explore: ', id);
    }
  };

  App.addInitializer(function(){
    router = new ExploresApp.Router({controller: API});
  });

});