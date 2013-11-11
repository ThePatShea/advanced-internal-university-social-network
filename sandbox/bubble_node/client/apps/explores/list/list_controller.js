App.module("ExploresApp.List", function(List, App, Backbone, Marionette, $, _){
  //List controller code goes here
  List.Controller = App.Controllers.Base.extend({
    initialize: function(options){
      console.log('Explore Show');
      this.layout = new List.Layout();
      this.show(this.layout);
      var listView = new List.Explores();
      this.layout.subpanelRegion.show(listView);
    }
  });
})