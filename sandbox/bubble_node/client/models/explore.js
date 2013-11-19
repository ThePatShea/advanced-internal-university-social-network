App.module("Models", function(Models, App, Backbone, Marionette, $, _){

  Models.Explore = Backbone.Model.extend({
    choose: function(){
      this.set({chosen: true})
    },

    unchoose: function(){
      this.set({chosen: false});
    }
  })

  Models.ExploresCollection = Backbone.Collection.extend({
    model: Models.Explore,
    url: "/explores",
    chooseBy: function(name){
      _(this.where({chosen: true})).invoke('unchoose');
      this.findWhere({name: name}).choose()
    },

    setChosenExplore: function(id){
      var model = this.get(id) || this.first()
      model.choose();
    }
  })

  var API = {
    getExplores: function(){
      var explores = new Models.ExploresCollection()
      explores.fetch({reset: true})
      return explores
    },

    getExplore: function(id){
      var m = new Models.Explore({id: id})
      // m.fetch()
      return m
    }
  };

  App.reqres.setHandler("explore:entities", function(){
    return API.getExplores();
  });

  App.reqres.setHandler("explore:entity", function(id){
    return API.getExplore(id);
  });

});
