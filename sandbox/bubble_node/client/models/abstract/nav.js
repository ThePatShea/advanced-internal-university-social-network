App.module("Models", function(Models, App, Backbone, Marionette, $, _){

  Models.Nav = Backbone.Model.extend({
    choose: function(){
      this.set({chosen: true});
    },

    unchoose: function(){
      this.set({chosen: false});
    }
  });

  Models.NavCollection = Backbone.Collection.extend({
    model: Models.Nav,
    chooseBy: function(name){
      _(this.where({chosen: true})).invoke('unchoose');
      this.findWhere({navName: name}).choose();
    }
  });

  var API = {
    getNavs: function(){
      return new Models.NavCollection([
        { name: "Dashboard", navName: "dashboard", cssId: "dashboard" },
        { name: "Bubbles",   navName: "bubbles",   cssId: "mybubbles" },
        { name: "Explore",   navName: "explore",   cssId: "explore"   },
        { name: "Search",    navName: "search",    cssId: "search"    },
        { name: "Settings",  navName: "settings",  cssId: "settings"  }
      ]);
    }
  };

  App.reqres.setHandler("nav:entities", function(){
    return API.getNavs();
  });

});
