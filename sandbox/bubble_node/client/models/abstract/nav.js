App.module("Models", function(Models, App, Backbone, Marionette, $, _){

  Models.Nav = Backbone.Model.extend({
    choose: function(){
      this.set({chosen: true})
    }
  })

  Models.NavCollection = Backbone.Collection.extend({
    chooseBy: function(name){
      this.findWhere({name: name}).choose()
    }
  })

  var API = {
    getNavs: function(){
      return new Models.NavCollection([
        { name: "Dashboard", navName: "dashboard", cssId: "dashboard" },
        { name: "Bubbles",   navName: "bubbles",   cssId: "mybubbles" },
        { name: "Explore",   navName: "explore",   cssId: "explore"   },
        { name: "Search",    navName: "search",    cssId: "search"    },
        { name: "Settings",  navName: "settings",  cssId: "settings"  }
      ])
    }
  };

  App.reqres.setHandler("nav:entities", function(){
    return API.getNavs()
  });

});
