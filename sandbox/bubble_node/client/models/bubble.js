App.module("Models", function(Models, App, Backbone, Marionette, $, _){

  Models.Bubble = Backbone.Model.extend({
    choose: function(){
      this.set({chosen: true})
    }
  })

  Models.BubbleCollection = Backbone.Collection.extend({
    chooseBy: function(name){
      this.findWhere({name: name}).choose()
    }
  })

  var API = {
    getBubbles: function(){
      return new Models.BubbleCollection([
        { name: "Class 2016" },
        { name: "Class 2015" },
        { name: "Class 2014" },
        { name: "Class 2013" }
      ])
    }
  };

  App.reqres.setHandler("bubble:entities", function(){
    return API.getBubbles();
  });

});
