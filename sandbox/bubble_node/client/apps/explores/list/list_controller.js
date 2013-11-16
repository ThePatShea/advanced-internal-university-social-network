App.module("ExploresApp.List", function(List, App, Backbone, Marionette, $, _){

  List.Controller = App.Controllers.Base.extend({
    initialize: function(options){
      var explores = App.request("explore:entities");

      this.listenTo(explores, "change:chosen", function(model, value, options){
        if(value){
          this.showExplore(model);
        }
      });

      this.layout = new List.Layout();

      this.listenTo(this.layout, "show", function(){
        this.exploreRegion(explores);
        explores.setChosenExplore(options.id);
      });
      
      this.show(this.layout, {
        loading: { 
          entities: explores,
          done: function(){}
        }
      });
    },

    exploreRegion: function(explores){
      var listView = new List.Explores({collection: explores});

      this.listenTo(listView, "itemview:explore:clicked", function(iv, obj){
        explores.chooseBy(obj.model.get("name"));
      });

      this.show(listView, {region: this.layout.subpanelRegion});
    },

    showExplore: function(explore){
      App.execute("show:explore", explore, this.layout.showRegion);
    }
  });
});