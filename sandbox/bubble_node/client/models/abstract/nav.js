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
        { name: "Dashboard", cssId: "dashboard" },
        { name: "Bubbles",   cssId: "mybubbles" },
        { name: "Explore",   cssId: "explore"   },
        { name: "Search",    cssId: "search"    },
        { name: "Settings",  cssId: "settings"  }
      ])
    }
  };

  App.reqres.setHandler("nav:entities", function(){
    return API.getNavs()
  });

});
