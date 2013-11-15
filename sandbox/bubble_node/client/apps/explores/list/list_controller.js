App.module("ExploresApp.List", function(List, App, Backbone, Marionette, $, _){

  List.Controller = App.Controllers.Base.extend({
    initialize: function(options){
      this.layout = new List.Layout();
      this.show(this.layout);

      var listView = new List.Explores();
      this.layout.subpanelRegion.show(listView);
    }
  });
});